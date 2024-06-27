import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign into Flycatcher",
}

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}

export default SignInPage
