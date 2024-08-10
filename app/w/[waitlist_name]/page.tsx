import { getWaitlist } from "@/utils/actions/getWaitlist"
import { getWaitlistSlugs } from "@/utils/actions/getWaitlistSlugs"
import { notFound } from "next/navigation"
import Image from "next/image"
import tinycolor from "tinycolor2"
import SignupForm from "./SignupForm"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export async function generateStaticParams() {
  const response = await getWaitlistSlugs()

  if (!response.success || !response.data) {
    return []
  }

  const waitlists = response.data

  return waitlists.map((waitlist) => ({
    waitlist_name: waitlist.urlName,
  }))
}

export default async function Waitlist({ params }: { params: { waitlist_name: string } }) {
  const response = await getWaitlist(params.waitlist_name)

  const waitlist = response.data

  if (!response.success || !waitlist) {
    notFound()
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex justify-center items-center" style={{ backgroundColor: waitlist.settings.primaryColor }}>
        <div className="absolute top-0 left-0 p-4">
          <Image src={waitlist.images.logo} hidden={!waitlist.images.logo} alt="Logo" width={300} height={300} className="w-40" />
        </div>
        <div className="w-1/2 flex flex-col space-y-6">
          <div className="flex flex-col w-full space-y-2">
            <h1 className="text-3xl font-bold break-words" style={{ color: waitlist.settings.textColor }}>
              {waitlist.settings.titleText}
            </h1>
            <p className="break-words" style={{ color: tinycolor(waitlist.settings.textColor).setAlpha(0.7).toRgbString() }}>
              {waitlist.settings.subtitleText}
            </p>
          </div>

          <SignupForm waitlist={waitlist} />
        </div>
      </div>

      <div className="w-1/2 flex justify-center items-center" style={{ backgroundColor: waitlist.settings.accentColor }}>
        <div className="w-[85%] max-w-[50rem]">
          <AspectRatio ratio={16 / 9} hidden={!waitlist.images.preview}>
            <Image src={waitlist.images.preview} alt="Preview image" fill className="rounded-md object-cover" />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
