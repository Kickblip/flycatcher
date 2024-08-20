"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { FaWallet, FaBoltLightning, FaArrowRightFromBracket } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Cloud,
  CreditCard,
  CloudLightning,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  UserPlus,
  BarChart,
  Users,
} from "lucide-react"

export default function UserButton({ urlName }: { urlName?: string }) {
  const [user, setUserData] = useState<User | null>(null)
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

  if (!user) return <></>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={user?.user_metadata.avatar_url}
          alt="User profile picture"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex items-center">
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
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {urlName && (
          <>
            <DropdownMenuGroup className="sm:hidden">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/${urlName}/customize`)
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Customize</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/${urlName}/contacts`)
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Contacts</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/${urlName}/analytics`)
                }}
              >
                <BarChart className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/${urlName}/campaigns`)
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                <span>Campaigns</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="sm:hidden" />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push("/dashboard/subscription")
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              router.push("/dashboard/subscription")
            }}
          >
            <CloudLightning className="mr-2 h-4 w-4" />
            <span>Usage</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              await supabase.auth.refreshSession()
              router.push("/")
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
