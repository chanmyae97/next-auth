"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log("Login attempt with values:", { ...values, password: "REDACTED" });

  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    console.log("Validation failed:", validateFields.error);
    return { error: "Invalid Fields" };
  }

  const { email, password, code } = validateFields.data;

  const existingUser = await getUserByEmail(email);
  console.log("Found user:", { 
    id: existingUser?.id,
    email: existingUser?.email,
    emailVerified: existingUser?.emailVerified,
    isTwoFactorEnabled: existingUser?.isTwoFactorEnabled
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    console.log("Invalid credentials - user not found or missing email/password");
    return { error: "Invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    console.log("Email not verified, generating verification token");
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    console.log("2FA is enabled for user");
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      console.log("2FA token found:", !!twoFactorToken);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      console.log("Generated new 2FA token");

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    console.log("Attempting to sign in with credentials");
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false // Don't redirect automatically
    });
    console.log("Sign in result:", signInResult);

    if (signInResult?.error) {
      return { error: "Invalid credentials!" };
    }

    return { success: "Logged in successfully!" };
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
