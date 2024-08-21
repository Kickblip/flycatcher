import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { analytics } from "@/utils/analytics/analytics"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/w/")) {
    const waitlistName = pathname.split("/")[2]
    const userAgent = request.headers.get("user-agent") || ""
    let deviceType: string
    if (!userAgent) {
      deviceType = "unknown"
    } else {
      const isMobile = /mobile/i.test(userAgent)
      deviceType = isMobile ? "mobile" : "desktop"
    }
    await analytics.track("pageview", waitlistName, { country: request.geo?.country, deviceType: deviceType })
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/pub/|api/clear-unused-images|api/uploadthing|auth/|^/|.*\\.(?:svg|png|jpg|mp4|jpeg|gif|webp)$).*)",
  ],
}
