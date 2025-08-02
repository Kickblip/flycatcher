import { FaChevronRight } from "react-icons/fa6"
import Link from "next/link"
import Badge from "./Badge"

export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full bg-cover bg-center bg-no-repeat md:-m-4 md:bg-[url('/landing/hero-bg.png')]">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center text-black space-y-6 mb-32 md:mb-56">
        <Badge />
        <h1 className="text-5xl md:text-6xl px-4 md:px-0 font-bold">
          All your launch tools.
          <br />
          <span className="text-redorange-500">One app.</span>
        </h1>
        <p className="text-lg md:text-xl px-4 md:px-0 md:w-[28rem] break-words">
          Start a waitlist, measure analytics, and send emails all in one place.{" "}
        </p>
        <div className="flex items-center flex-col ">
          <Link
            href="/dashboard/home"
            className="px-6 py-3 bg-redorange-500 hover:bg-redorange-300 transition duration-200 rounded-lg"
          >
            <div className="flex items-center text-white">
              <p className="mr-2">Launch your product</p>
              <FaChevronRight className="w-4 h-4" />
            </div>
          </Link>
          <Link
            href="https://youtu.be/Fd-YlAAcytk"
            className="px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center text-black text-sm font-semibold mt-2 transition duration-200 "
            target="_blank"
          >
            <p className="mr-2">Watch full demo</p>
            <FaChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
