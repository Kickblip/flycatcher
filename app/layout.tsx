import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flycatcher | Pre-launch campaigns",
  description: "Build a waitlist, measure analytics, and send emails with a single app.",
  openGraph: {
    url: "https://flycatcher.app/",
    title: "Pre-launch campaigns",
    description: "Build a waitlist, measure analytics, and send emails with a single app.",
    siteName: "Flycatcher",
    images: [
      {
        url: "https://flycatcher.app/ogimage.png",
        width: 1200,
        height: 628,
        alt: "Waitlist Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pre-launch campaigns",
    description: "Build a waitlist, measure analytics, and send emails with a single app.",
    images: { url: "https://flycatcher.app/ogimage.png", alt: "Waitlist Page" },
  },
  category: "software",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Analytics />
        <main>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
        </main>
      </body>
    </html>
  )
}
