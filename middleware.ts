import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// This Middleware does not protect any routes by default.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
