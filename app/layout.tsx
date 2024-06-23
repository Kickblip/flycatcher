import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastContainer, toast } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flycatcher",
  description: "Feedback suite for early stage founders to easily validate and iterate their ideas.",
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
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
