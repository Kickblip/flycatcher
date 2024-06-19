import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

function Hero() {
  return (
    <section className="container w-full">
      <div className="grid place-items-center gap-8 mx-auto py-20 md:py-32">
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

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`We make measuring interest, collecting feedback, and building a community easy so you can focus on building a product people want.`}
          </p>

          <div className="flex flex-col md:flex-row md:space-x-4 text-white justify-center">
            <button className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 font-bold flex items-center justify-center rounded-md">
              <Link href="/dashboard/home" className="flex items-center justify-center w-full">
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

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 rounded-full"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center"
            src={"/landing/suggestion-demo.jpg"}
            alt="dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 rounded-lg"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
