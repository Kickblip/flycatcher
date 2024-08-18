import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { UploadDropzone } from "@/utils/uploadthing"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import Image from "next/image"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ImageManager() {
  const { waitlist } = useWaitlistStore()

  if (!waitlist) return null

  return (
    <Sheet>
      <SheetTrigger className="w-full py-2">Image Manager</SheetTrigger>
      <SheetContent className="w-[50rem]" side="right">
        <SheetHeader>
          <SheetTitle>Manage uploaded images</SheetTitle>
          <SheetDescription>Click an image to copy the URL then paste into your block</SheetDescription>
          <div className="w-full pt-4">
            <UploadDropzone
              endpoint="waitlistEmailContent"
              input={waitlist.urlName}
              onClientUploadComplete={(res) => {
                useWaitlistStore.getState().update({ ...waitlist, uploadedContent: [...waitlist.uploadedContent, res[0].url] })
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
                uploadIcon: {
                  color: "#FF3300",
                },
                container: {
                  backgroundColor: "#f9fafb",
                },
              }}
            />
          </div>
        </SheetHeader>
        <h2 className="text-lg font-semibold mt-6">Uploaded images</h2>
        <div className="flex flex-col mt-4">
          {waitlist.uploadedContent.map((url, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded"
              onClick={() => {
                navigator.clipboard.writeText(url)
                toast.success("Copied URL to clipboard")
              }}
            >
              <Image src={url} alt="Uploaded content" width={500} height={500} className="w-1/3" />
              <p className="text-sm font-normal text-gray-600">{url}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
