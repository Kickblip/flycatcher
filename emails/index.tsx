import { Button, Html, Head, Tailwind } from "@react-email/components"
import * as React from "react"

export default function Email() {
  return (
    <Tailwind>
      <Head>
        <title>My email title</title>
      </Head>
      <Button href="https://example.com" className="bg-red-500 text-white px-4 py-2">
        Click me
      </Button>
    </Tailwind>
  )
}
