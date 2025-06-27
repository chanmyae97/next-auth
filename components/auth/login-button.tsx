"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
  callbackUrl?: string;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
  callbackUrl,
}: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push(
      `/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`
    );
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <DialogTitle className="sr-only">Login Form</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your credentials to login to your account
          </DialogDescription>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
