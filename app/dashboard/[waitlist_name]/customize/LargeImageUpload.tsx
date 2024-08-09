import { WaitlistImages, WaitlistPage } from "@/types/WaitlistPage"
import { UploadButton } from "@/utils/uploadthing"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export default function SmallImageUpload({
  pageWaitlist,
  setPageWaitlist,
  endpoint,
  imageKey,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
  endpoint: "waitlistLogo" | "waitlistFavicon" | "waitlistPreview"
  imageKey: string
}) {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div hidden={!pageWaitlist.images[imageKey as keyof WaitlistImages]} className="w-full flex justify-center shadow">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={pageWaitlist.images[imageKey as keyof WaitlistImages]}
            alt="Uploaded image"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
      </div>

      <UploadButton
        endpoint={endpoint}
        input={pageWaitlist.urlName}
        onClientUploadComplete={(res) => {
          setPageWaitlist({
            ...pageWaitlist,
            images: {
              ...pageWaitlist.images,
              [imageKey]: res[0].url,
            },
          })
        }}
        onUploadError={(error: Error) => {
          console.error(error.message)
        }}
        appearance={{
          button: {
            backgroundColor: "#FF3300",
            color: "fff",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
          },
        }}
      />
    </div>
  )
}
