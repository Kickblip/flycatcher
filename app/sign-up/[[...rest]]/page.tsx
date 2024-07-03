import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for Flycatcher",
}

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" passHref>
        <Image src="/landing/logo.png" alt="Redirect to Home" className="mb-4" width={200} height={200} />
      </Link>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  )
}
export default SignUpPage
