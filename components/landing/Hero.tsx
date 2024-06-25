import Link from "next/link"
import { ArrowRightIcon, LinkIcon } from "@heroicons/react/24/outline"
import { Button } from "./ui/MovingBorder"

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

          <div className="flex flex-col md:flex-row md:space-x-4 justify-center">
            <div className="flex flex-col items-center md:mb-0 mb-4">
              <Link href="/b/flycatcher" target="_blank">
                <Button borderRadius="0.75rem" className="bg-white border-fuchsia-500">
                  <div className="flex items-center justify-center w-full font-bold text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text">
                    <LinkIcon className="w-4 h-4 text-fuchsia-700 mr-2 text-lg" strokeWidth={2} />
                    flycatcher.app/b/flycatcher
                  </div>
                </Button>
              </Link>
              <Link href="/b/flycatcher" target="_blank" className="text-xs text-gray-500 mt-1 cursor-pointer">
                See a live feedback board
              </Link>
            </div>

            <button className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 font-bold flex items-center justify-center rounded-xl h-14 md:w-64 w-full">
              <Link href="/dashboard/boards" className="flex items-center justify-center w-full text-white text-sm">
                Create your own
                <ArrowRightIcon className="w-4 h-4 ml-2" strokeWidth={2} />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
