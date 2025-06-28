import { Suspense } from "react";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerification = () => {
  return (
    <div>
      <Suspense>
        <NewVerificationForm />
      </Suspense>
    </div>
  );
};

export default NewVerification;
