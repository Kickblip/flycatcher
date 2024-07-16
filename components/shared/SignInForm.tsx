"use client"

import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { Provider } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function SignInForm({ redirectUrl }: { redirectUrl?: string }) {
  const router = useRouter()

  const signIn = async (provider: Provider) => {
    const supabase = createClient()
    const origin = window.location.origin

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl ? redirectUrl : "/")}`,
      },
    })

    if (error) {
      console.error(error)
    } else {
      router.push(data.url)
    }
  }

  return (
    <div className="bg-white px-8 py-10 rounded-lg shadow-lg max-w-md w-96">
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold mb-1">Sign in</h1>
        <p className="text-xs text-gray-500">Welcome back! Please sign in to continue</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            signIn("google")
          }}
          className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <Image src="/shared/google-144.png" alt="Sign in with Google" width={24} height={24} className="mr-2" />
        </button>
        <button
          onClick={() => {
            signIn("github")
          }}
          className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <Image src="/shared/github-128.png" alt="Sign in with GitHub" width={24} height={24} className="mr-2" />
        </button>

        <button
          onClick={() => {
            signIn("discord")
          }}
          className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <Image src="/shared/discord-144.png" alt="Sign in with Discord" width={24} height={24} className="mr-2" />
        </button>
      </div>
    </div>
  )
}
