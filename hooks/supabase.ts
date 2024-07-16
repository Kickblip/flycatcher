import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { Users } from "@/types/Supabase"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [stripeData, setStripeData] = useState<Users | null>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (user) {
        const { data: userStripeData, error: userStripeDataError } = await supabase
          .from("user")
          .select("*")
          .eq("user_id", user.id)
          .single()

        setStripeData(userStripeData)
        setUser(user)
      }
    }

    fetchData()
  }, [])

  return { user, stripeData, error }
}
