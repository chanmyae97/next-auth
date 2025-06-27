import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/next-auth";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  console.log("useCurrentUser hook - session:", session);
  console.log("useCurrentUser hook - status:", status);

  return session?.user as ExtendedUser;
};
