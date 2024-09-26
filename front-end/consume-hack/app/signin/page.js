import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-full mt-20">
      <SignIn forceRedirectUrl="/user-details" routing="hash" />
    </div>
  );
}
