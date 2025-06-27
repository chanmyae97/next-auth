"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callBackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-1/2"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-1/2 "
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
