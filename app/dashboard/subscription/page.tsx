import type { Metadata } from "next"
import Navbar from "@/components/dashboard/Navbar"
import Image from "next/image"
import SubscriptionCard from "@/components/dashboard/subscription/SubscriptionCard"
import UsagePanel from "@/components/dashboard/subscription/UsagePanel"
import { currentUser } from "@clerk/nextjs/server"

export const metadata: Metadata = {
  title: "Subscriptions | Flycatcher",
  description: "Manage your Flycatcher subscriptions.",
}

export default async function DashboardSubscriptions() {
  const freeFeatures = ["Unlimited users", "Kanban view", "Custom logos", "Custom color palettes"]
  const paidFeatures = ["Unlimited posts", "Up to 10 feedback boards", "Custom metadata", "Remove Flycatcher branding"]
  const user = await currentUser()

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-wrap justify-center">
        <div className="flex flex-col w-full">
          {/* @ts-ignore */}
          {!user?.isPremium ? (
            <>
              <div className="flex items-center">
                <Image
                  src={user?.imageUrl || "https://flycatcher.app/board-pages/default-pfp.png"}
                  alt="Profile Picture"
                  className="rounded-full object-cover w-16 h-16"
                  width={500}
                  height={500}
                />
                <div className="">
                  <p className="text-xl font-semibold ml-4">{user?.username || user?.firstName || "Anonymous"}</p>
                  <p className="text-sm font-normal text-gray-500 ml-4">{user?.emailAddresses[0].emailAddress}</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mt-8">Billing</h2>
            </>
          ) : (
            <></>
          )}
          <h2 className="text-xl font-semibold mt-8">Usage</h2>
          {/* @ts-ignore */}
          <UsagePanel isPremium={user?.isPremium} />
          {/* @ts-ignore */}
          {!user?.isPremium ? (
            <></>
          ) : (
            <div className="flex items-center">
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
          )}
        </div>
      </div>
    </main>
  )
}
