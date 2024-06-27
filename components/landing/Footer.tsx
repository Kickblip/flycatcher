import Image from "next/image"

function Footer() {
  return (
    <footer className="w-full bg-gray-50 text-white py-4 h-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <Image src="/board-pages/dark-logo.png" alt="Logo" width={170} height={170} />
        </div>
        <div className="flex space-x-4">
          <a
            href="/terms"
            className="text-gray-700 font-semibold text-sm md:text-md hover:text-gray-800 hover:underline transition duration-200"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-gray-700 font-semibold text-sm md:text-md hover:text-gray-800 hover:underline transition duration-200"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
