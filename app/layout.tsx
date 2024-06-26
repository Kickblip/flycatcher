import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastContainer } from "react-toastify"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flycatcher | Community Feedback Boards",
  description: "Start collecting community feedback in minutes, not hours.",
  openGraph: {
    url: "https://flycatcher.app/",
    title: "Community Feedback Boards",
    description: "Start collecting community feedback in minutes, not hours.",
    siteName: "Flycatcher",
    images: [
      {
        url: "https://flycatcher.app/ogimage.png",
        width: 1200,
        height: 628,
        alt: "Feedback board",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Feedback Boards",
    description: "Start collecting community feedback in minutes, not hours.",
    images: { url: "https://flycatcher.app/ogimage.png", alt: "Feedback board" },
  },
  category: "software",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastContainer />
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
    </ClerkProvider>
  )
}
