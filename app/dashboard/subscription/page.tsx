import type { Metadata } from "next"
import Navbar from "@/app/dashboard/home/Navbar"
import SubscriptionCard from "./SubscriptionCard"
import UsagePanel from "./UsagePanel"
import BillingManagerPanel from "./BillingManagerPanel"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Subscriptions | Flycatcher",
  description: "Manage your Flycatcher subscriptions.",
}

export default async function DashboardSubscriptions() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  let { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user?.id).single()

  if (!userMetadata) {
    userMetadata = { is_premium: false } // handle a 0 rows returned error
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
        <UsagePanel isPremium={userMetadata.is_premium as boolean} />
        {userMetadata.is_premium ? (
          <BillingManagerPanel
            avatarUrl={user?.user_metadata.avatar_url || "https://flycatcher.app/board-pages/default-pfp.png"}
            displayName={user?.user_metadata.user_name || user?.user_metadata.full_name || "Anonymous"}
            email={user?.email as string}
          />
        ) : (
          <SubscriptionCard
            title="Growth"
            subtitle="More feedback and additional features"
            price={20}
            features={["Unlimited contacts", "10,000 emails / month", "Remove Flycatcher branding"]}
          />
        )}
      </div>
    </main>
  )
}
