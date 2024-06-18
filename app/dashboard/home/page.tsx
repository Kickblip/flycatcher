import { auth, currentUser } from "@clerk/nextjs/server"
import Navbar from "@/components/dashboard/Navbar"

export default async function DashboardHome() {
  // const { userId } = auth()
  // if (userId) {
  //   // Query DB for user specific information or display assets only to signed in users
  // }
  // const user = await currentUser()

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4">{/* dashboard content */}</div>
    </main>
  )
}
