import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SignInForm from "@/components/shared/SignInForm"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign into Flycatcher",
}

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" passHref>
        <Image src="/landing/logo.png" alt="Redirect to Home" className="mb-4" width={200} height={200} />
      </Link>
      <SignInForm />
    </div>
  )
}

export default SignInPage
