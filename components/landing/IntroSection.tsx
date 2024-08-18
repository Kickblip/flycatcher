import Image from "next/image"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"

export default function IntroSection() {
  return (
    <section className="w-full flex flex-col md:flex-row my-32">
      <div className="w-full md:w-1/2 p-4 text-left flex items-center">
        <div className="flex flex-col space-y-6">
          <h2 className="text-5xl font-semibold">Find your users before you launch</h2>
          <p>
            Name your waitlist, pick your colors, upload images, and share it. No long setups, no headaches. Build a mailing list
            of users before your product is ready so you can launch with a bang.
          </p>
          <Link
            href="/w/flycatcher"
            className="w-72 py-3 justify-center flex bg-redorange-500 hover:bg-redorange-300 transition duration-200 rounded-lg"
            target="_blank"
          >
            <div className="flex items-center text-white">
              <p className="mr-2">View an example waitlist</p>
              <FaChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col space-y-4">
        <Image src="/landing/iphone.png" width={1000} height={1000} alt="iPhone preview image" />
      </div>
    </section>
  )
}
