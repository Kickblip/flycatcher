import { WaitlistPage } from "@/types/WaitlistPage"
import Image from "next/image"
import tinycolor from "tinycolor2"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function WaitlistPreview({
  pageWaitlist,
  setPageWaitlist,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
}) {
  return (
    <div className="w-full flex h-96 shadow">
      <div
        className="w-1/2 rounded-l flex flex-col space-y-3 justify-center items-start px-16"
        style={{ backgroundColor: pageWaitlist.settings.primaryColor }}
      >
        <Image
          src={pageWaitlist.images.logo}
          hidden={!pageWaitlist.images.logo}
          alt="Logo"
          width={300}
          height={300}
          className="w-16 -mb-1"
        />
        <div className="flex flex-col w-full">
          <h1 className="text-sm font-medium mb-1" style={{ color: pageWaitlist.settings.textColor }}>
            {pageWaitlist.settings.titleText}
          </h1>
          <p className="text-[0.5rem]" style={{ color: tinycolor(pageWaitlist.settings.textColor).setAlpha(0.7).toRgbString() }}>
            {pageWaitlist.settings.subtitleText}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <label
            className="text-[0.4rem] opacity-80 font-semibold mb-0.5"
            style={{ color: pageWaitlist.settings.textColor }}
            htmlFor="email-input"
          >
            Email
          </label>
          <style jsx>{`
            #email-input::placeholder {
              color: ${tinycolor(pageWaitlist.settings.textColor).setAlpha(0.3).toRgbString()};
            }
          `}</style>
          <input
            id="email-input"
            type="text"
            className="px-2 py-1 text-[0.5rem] p-0.5 border rounded-sm w-full"
            style={{
              backgroundColor: pageWaitlist.settings.primaryColor,
              borderColor: tinycolor(pageWaitlist.settings.textColor).setAlpha(0.3).toRgbString(),
            }}
            placeholder="Enter your email"
            disabled
          />
        </div>
        <button
          className="px-2 py-1 text-[0.5rem] font-medium w-full text-white rounded-sm"
          style={{ backgroundColor: pageWaitlist.settings.accentColor, color: pageWaitlist.settings.secondaryColor }}
          disabled
        >
          Join waitlist
        </button>
      </div>
      <div className="w-1/2 rounded-r relative overflow-hidden" style={{ backgroundColor: pageWaitlist.settings.accentColor }}>
        <div className="w-[30rem]">
          <AspectRatio
            ratio={16 / 9}
            hidden={!pageWaitlist.images.preview}
            className="absolute transform translate-x-[10%] translate-y-[20%]"
          >
            <Image src={pageWaitlist.images.preview} alt="Preview image" fill className="rounded-md object-cover" />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
