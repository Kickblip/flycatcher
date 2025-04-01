import { FaChevronRight } from "react-icons/fa6"
import Link from "next/link"
import Badge from "./Badge"

export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full bg-cover bg-center bg-no-repeat md:-m-4 md:bg-[url('/landing/hero-bg.png')]">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center text-black space-y-6 mb-32 md:mb-64">
        <div className="md:mb-10">
          <Badge />
        </div>
        <h1 className="text-5xl md:text-6xl px-4 md:px-0 font-bold">
          Validate your idea
          <br />
          <span className="text-redorange-500">before development</span>
        </h1>
        <p className="text-lg md:text-xl px-4 md:px-0 md:w-[28rem] break-words">
          Build an audience before writing a single line of code
        </p>
        <div className="flex items-center flex-col ">
          <Link
            href="/dashboard/home"
            className="px-6 py-3 bg-redorange-500 hover:bg-redorange-300 transition duration-200 rounded-lg"
          >
            <div className="flex items-center text-white">
              <p className="mr-2">Build your first waitlist</p>
              <FaChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <p className="mt-2 opacity-80 text-sm">No credit card required</p>
        </div>
      </div>
    </div>
  )
}
