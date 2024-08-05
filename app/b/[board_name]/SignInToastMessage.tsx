import React from "react"
import { toast } from "react-toastify"
import Link from "next/link"

const CustomToastMessage = () => (
  <div>
    <p>
      Please{" "}
      <Link href="/sign-up" className="text-blue-500 underline">
        create an account
      </Link>{" "}
      to interact with this board.
    </p>
  </div>
)

export const SignInToastMessage = () => {
  toast(<CustomToastMessage />, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
