"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { AdjustmentsVerticalIcon, ArrowLeftStartOnRectangleIcon, WalletIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export default function UserButton() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUserData] = useState<User | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (user) {
        setUserData(user)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return <></>

  return (
    <div className="relative">
      <div ref={buttonRef} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
        <Image
          src={user?.user_metadata.avatar_url}
          alt="User profile picture"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>

      {menuOpen && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10">
          <div className="flex items-center px-4 pt-4">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image
                src={user?.user_metadata.avatar_url}
                alt="User profile picture"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">{user?.user_metadata.user_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col font-medium">
            <div className="border-t border-gray-200 mx-4 mt-4" />
            <Link
              href="/dashboard/subscription"
              className="p-4 w-full text-left hover:bg-gray-100 flex items-center transition duration-200"
            >
              <AdjustmentsVerticalIcon className="w-5 h-5 mr-3" />
              <span className="text-sm">Usage</span>
            </Link>
            <Link
              href="/dashboard/subscription"
              className="p-4 w-full text-left hover:bg-gray-100 flex items-center transition duration-200"
            >
              <WalletIcon className="w-5 h-5 mr-3" strokeWidth={1.7} />
              <span className="text-sm">Billing</span>
            </Link>

            <div className="border-t border-gray-200 mx-4" />
            <button
              className="p-4 w-full text-left hover:bg-gray-100 flex items-center transition duration-200 rounded-b-lg"
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                await supabase.auth.refreshSession()
                router.push("/")
              }}
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-3" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
