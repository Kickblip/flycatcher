import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import UserButton from "@/components/shared/UserButton"

async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return (
    <nav className="w-full m-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link href="/">
              <Image src="/landing/logo.png" alt="Logo" width={170} height={170} />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user?.id ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/home">
                  <div className="text-white bg-redorange-500 hover:bg-redorange-300 transition duration-200 px-4 py-2 rounded-md text-md mr-2">
                    Dashboard
                  </div>
                </Link>
                <UserButton />
              </div>
            ) : (
              <Link href="/dashboard/home">
                <div className="bg-redorange-500 hover:bg-redorange-300 transition duration-200 text-white px-4 py-2 rounded-md">
                  Log In
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
