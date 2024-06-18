import { auth, currentUser } from "@clerk/nextjs/server"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default async function DashboardHome() {
  const { userId } = auth()
  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }
  const user = await currentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  )
}
