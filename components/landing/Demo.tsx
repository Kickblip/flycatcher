function Demo() {
  return (
    <section className="w-full">
      <div className="relative mx-auto w-full lg:w-[80%] 2xl:w-full">
        <div className="absolute inset-0 bg-fuchsia-700 rounded-xl blur-lg -z-10"></div>
        <video
          className="w-full h-full object-cover mx-auto rounded-xl relative z-10"
          poster="/landing/demo-cover.png"
          loop
          controls
        >
          <source src="/landing/demo.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}

export default Demo
