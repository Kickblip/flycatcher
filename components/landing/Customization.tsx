import { PaintBrushIcon, LockClosedIcon, CubeIcon, InformationCircleIcon } from "@heroicons/react/24/outline"

function Customization() {
  return (
    <section className="w-full flex flex-col md:flex-row my-32">
      <div className="w-full md:w-1/2 py-4 md:py-4 md:px-4">
        <h2 className="text-5xl font-semibold mb-6 text-center">Deep customization</h2>
        <div className="grid grid-cols-2 md:gap-4 ">
          <div className="flex flex-col items-center justify-center p-4">
            <PaintBrushIcon className="w-10 h-10 mb-2 text-fuchsia-500" />
            <span className="text-center text-black text-lg font-bold">Color Selector</span>
            <span className="text-center text-gray-800 text-sm">Match your brand's palette exactly with our color selector</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <LockClosedIcon className="w-10 h-10 mb-2 text-fuchsia-500" />
            <span className="text-center text-black text-lg font-bold">Authentication</span>
            <span className="text-center text-gray-800 text-sm">Force sign in or allow anonymous voting</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <CubeIcon className="w-10 h-10 mb-2 text-fuchsia-500" />
            <span className="text-center text-black text-lg font-bold">Custom Branding</span>
            <span className="text-center text-gray-800 text-sm">Upload your logo and display it directly on your board</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <InformationCircleIcon className="w-10 h-10 mb-2 text-fuchsia-500" />
            <span className="text-center text-black text-lg font-bold">Custom Metadata</span>
            <span className="text-center text-gray-800 text-sm">
              Edit the tab title and upload a custom favicon for your board
            </span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4">
        <video
          className="w-full object-cover mx-auto rounded-xl relative z-10 shadow-xl"
          poster="/landing/demo-cover.png"
          loop
          muted
          controls={false}
          playsInline
          autoPlay
        >
          <source src="/landing/color-customization.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}

export default Customization
