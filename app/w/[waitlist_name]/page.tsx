import { getWaitlist } from "@/utils/actions/getWaitlist"
import { getWaitlistSlugs } from "@/utils/actions/getWaitlistSlugs"
import { notFound } from "next/navigation"
import Image from "next/image"
import tinycolor from "tinycolor2"
import SignupForm from "./SignupForm"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { socialIcons } from "@/utils/socialIcons"
import Link from "next/link"
import type { Metadata, ResolvingMetadata } from "next"
import FlycatcherBadge from "./FlycatcherBadge"

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

export async function generateMetadata(
  { params }: { params: { waitlist_name: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const response = await getWaitlist(params.waitlist_name)
  const waitlist = response.data

  if (!response.success || !waitlist) {
    return {
      title: "Waitlist not found",
    }
  }

  return {
    title: waitlist.settings.metadataTabTitle || waitlist.settings.titleText,
    description: waitlist.settings.subtitleText,
    icons: {
      icon:
        waitlist.images.favicon === ""
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`
          : new URL(waitlist.images.favicon, `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`),
    },
    openGraph: {
      images: [
        waitlist.images.preview === ""
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/ogimage.png`
          : new URL(waitlist.images.preview, `${process.env.NEXT_PUBLIC_SITE_URL}/ogimage.png`),
      ],
    },
  }
}

export default async function Waitlist({ params }: { params: { waitlist_name: string } }) {
  const response = await getWaitlist(params.waitlist_name)

  const waitlist = response.data

  if (!response.success || !waitlist) {
    notFound()
  }

  return (
    <div className="flex h-screen">
      <div
        className="w-full lg:w-1/2 flex justify-center items-center relative"
        style={{ backgroundColor: waitlist.settings.primaryColor }}
      >
        <div className="absolute top-0 left-0 p-4">
          <Image
            src={waitlist.images.logo}
            hidden={!waitlist.images.logo}
            alt="Logo"
            width={600}
            height={600}
            className="h-12 w-auto"
          />
        </div>
        <div className="w-3/4 lg:w-1/2 lg:max-w-lg flex flex-col space-y-6">
          <div className="flex flex-col w-full space-y-2">
            <h1 className="text-3xl font-bold break-words" style={{ color: waitlist.settings.textColor }}>
              {waitlist.settings.titleText}
            </h1>
            <p className="break-words" style={{ color: tinycolor(waitlist.settings.textColor).setAlpha(0.7).toRgbString() }}>
              {waitlist.settings.subtitleText}
            </p>
          </div>

          <SignupForm
            urlName={waitlist.urlName}
            primaryColor={waitlist.settings.primaryColor}
            secondaryColor={waitlist.settings.secondaryColor}
            textColor={waitlist.settings.textColor}
            accentColor={waitlist.settings.accentColor}
          />

          <div className="flex items-center w-full space-x-4">
            {Object.entries(waitlist.socialLinks)
              .filter(([key, value]) => value !== "")
              .map(([name, url], index) => {
                const SocialIcon = socialIcons[name as keyof typeof socialIcons]
                return (
                  <Link key={index} href={url} target="_blank">
                    <SocialIcon className="w-6 h-6" style={{ color: waitlist.settings.accentColor }} />
                  </Link>
                )
              })}
          </div>
        </div>
        {!waitlist.settings.disableBranding && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <FlycatcherBadge textColor={waitlist.settings.textColor} />
          </div>
        )}
      </div>

      <div
        className="w-1/2 hidden lg:flex justify-center items-center"
        style={{ backgroundColor: waitlist.settings.accentColor }}
      >
        <div className="w-[85%] max-w-[50rem]">
          <AspectRatio ratio={16 / 9} hidden={!waitlist.images.preview}>
            <Image src={waitlist.images.preview} alt="Preview image" fill className="rounded-md object-cover" />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
