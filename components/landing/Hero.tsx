import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="mx-auto text-center text-4xl md:text-7xl font-bold">
            <h1>
              Catching flies is hard. <br />
              <span className="text-transparent px-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text">
                Connecting with users
              </span>
              <br />
              {`shouldn't be.`}
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl">{`Start collecting feedback from your users in minutes, not hours.`}</p>

          <div className="flex flex-col md:flex-row md:space-x-4 text-white justify-center">
            <button className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 font-bold flex items-center justify-center rounded-md">
              <Link href="/dashboard/boards" className="flex items-center justify-center w-full">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" strokeWidth={2.5} />
              </Link>
            </button>

            {/* <button className="px-4 py-2 font-bold flex items-center justify-center text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 bg-clip-text">
              <Link href="/example" className="flex items-center justify-center w-full">
                Learn More
              </Link>
            </button> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
