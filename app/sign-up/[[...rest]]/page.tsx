import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for Flycatcher",
}

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  )
}
export default SignUpPage
