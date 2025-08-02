import Image from "next/image"
import Link from "next/link"

function Footer() {
  return (
    <footer className="w-full bg-gray-50 text-white py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <Image src="/board-pages/dark-logo.png" alt="Logo" width={170} height={170} />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 text-center">
          <Link
            href="/terms"
            className="text-gray-700 font-semibold text-sm md:text-md hover:text-gray-800 hover:underline transition duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-gray-700 font-semibold text-sm md:text-md hover:text-gray-800 hover:underline transition duration-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
