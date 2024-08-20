import { WaitlistImages, WaitlistPage } from "@/types/WaitlistPage"
import { UploadButton } from "@/utils/uploadthing"
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
    <div className="w-full flex items-center justify-between">
      <Image
        src={pageWaitlist.images[imageKey as keyof WaitlistImages]}
        hidden={!pageWaitlist.images[imageKey as keyof WaitlistImages]}
        alt="Uploaded image"
        width={500}
        height={500}
        className="h-24 w-auto shadow"
      />

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
