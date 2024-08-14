import Image from "next/image"
import Link from "next/link"
import { FaLink } from "react-icons/fa6"

export default function IntroSection() {
  return (
    <section className="w-full flex flex-col md:flex-row my-32">
      <div className="w-full md:w-1/2 p-4 text-left">
        <h2 className="text-5xl font-semibold mb-6">Find users before you launch</h2>
        <p className="">
          Name your board, pick your colors, upload your logo, and share it. No long setups, no headaches. Feedback is collected
          through a link you can share with your community.
        </p>
        <div className="flex w-full justify-center items-center mt-8">
          <Link
            href="https://flycatcher.app/w/flycatcher"
            className="flex items-center px-6 py-2 rounded border-2 border-redorange-500 text-redorange-500 hover:bg-redorange-500 hover:text-white transition duration-200"
          >
            <FaLink className="w-4 h-4 mr-2" />
            flycatcher.app/w/flycatcher
          </Link>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col space-y-4">
        <Image src="/landing/iphone.png" width={1000} height={1000} alt="iPhone preview image" />
      </div>
    </section>
  )
}
