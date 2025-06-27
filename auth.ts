import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

import { db } from "./lib/db";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback", { user, account });

      if (account?.provider !== "credentials") return true;

      if (!user.id) {
        console.log("No user ID present");
        return false;
      }

      const existingUser = await getUserById(user.id);
      console.log("Existing user:", existingUser);

      if (!existingUser?.emailVerified) {
        console.log("Email not verified");
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          console.log("2FA required but no confirmation found");
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ token, session }) {
      console.log("Session callback - Initial", { token, session });

      if (!token) {
        console.log("No token present in session callback");
        return session;
      }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      console.log("Session callback - Final", { session });
      return session;
    },

    async jwt({ token }) {
      console.log("JWT callback - Initial token:", token);

      if (!token.sub) {
        console.log("No sub in token");
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        console.log("No existing user found for token");
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      console.log("JWT callback - Modified token:", token);
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
