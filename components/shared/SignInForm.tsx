import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default function SignInForm() {
  const signIn = async () => {
    "use server"

    const supabase = createClient()
    const origin = headers().get("origin")

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
    } else {
      return redirect(data.url)
    }
  }

  return (
    <div className="bg-white px-8 py-10 rounded-lg shadow-lg max-w-md w-96">
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold mb-1">Sign in</h1>
        <p className="text-xs text-gray-500">Welcome back! Please sign in to continue</p>
      </div>

      <div className="space-y-4">
        <button className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200">
          <Image src="/shared/google-144.png" alt="Sign in with Google" width={24} height={24} className="mr-2" />
        </button>
        <form action={signIn}>
          <button className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200">
            <Image src="/shared/github-128.png" alt="Sign in with GitHub" width={24} height={24} className="mr-2" />
          </button>
        </form>
        <button className="flex items-center justify-center w-full shadow border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 transition duration-200">
          <Image src="/shared/discord-144.png" alt="Sign in with Discord" width={24} height={24} className="mr-2" />
        </button>
      </div>
    </div>
  )
}
