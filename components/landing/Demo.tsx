import Image from "next/image"

function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto">
        <Image
          width={1200}
          height={1200}
          className="w-full md:w-[1200px] mx-auto rounded-lg leading-none flex items-center"
          src={"/landing/suggestion-demo.jpg"}
          alt="dashboard"
        />
      </div>
    </section>
  )
}

export default Hero
