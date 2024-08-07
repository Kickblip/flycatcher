import type { Metadata } from "next"
import Navbar from "@/app/dashboard/home/Navbar"
import Image from "next/image"
import SubscriptionCard from "./SubscriptionCard"
import UsagePanel from "./UsagePanel"
import BillingManagerPanel from "./BillingManagerPanel"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Subscriptions | Flycatcher",
  description: "Manage your Flycatcher subscriptions.",
}

export default async function DashboardSubscriptions() {
  const freeFeatures = ["Unlimited users", "Kanban view", "Custom logos", "Custom color palettes"]
  const paidFeatures = ["Unlimited posts", "Up to 10 feedback boards", "Custom metadata", "Remove Flycatcher branding"]
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  let { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user?.id).single()

  if (!userMetadata) {
    userMetadata = { is_premium: false } // hacky way to handle a 0 rows returned error
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-wrap justify-center">
        <div className="flex flex-col w-full">
          {userMetadata.is_premium ? (
            <>
              <div className="flex items-center">
                <Image
                  src={user?.user_metadata.avatar_url || "https://flycatcher.app/board-pages/default-pfp.png"}
                  alt="Profile Picture"
                  className="rounded-full object-cover w-16 h-16"
                  width={500}
                  height={500}
                />
                <div className="">
                  <p className="text-xl font-semibold ml-4">
                    {user?.user_metadata.user_name || user?.user_metadata.full_name || "Anonymous"}
                  </p>
                  <p className="text-sm font-normal text-gray-500 ml-4">{user?.email}</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mt-8">Billing</h2>
              <BillingManagerPanel />
            </>
          ) : (
            <></>
          )}
          <h2 className="text-xl font-semibold mt-8">Usage</h2>
          <UsagePanel isPremium={userMetadata.is_premium as boolean} />
          {userMetadata.is_premium ? (
            <></>
          ) : (
            <>
              <h2 className="text-xl font-semibold mt-32">Upgrade</h2>
              <div className="flex flex-col md:flex-row items-center">
                <SubscriptionCard
                  title="Free"
                  subtitle="Essential features to set up your feedback board"
                  price={0}
                  features={freeFeatures}
                />
                <SubscriptionCard
                  title="Growth"
                  subtitle="More feedback and additional features"
                  price={10}
                  features={paidFeatures}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
