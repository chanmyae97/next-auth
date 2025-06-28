import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/new-password-form";

const NewPasswordPage = () => {
  return (
    <div>
      <Suspense>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
};

export default NewPasswordPage;
