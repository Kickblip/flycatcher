import { Suspense } from "react"
import CheckoutClient from "./CheckoutClient"

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  )
}
