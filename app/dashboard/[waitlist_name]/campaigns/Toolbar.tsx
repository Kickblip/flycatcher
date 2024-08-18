import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TemplateBlocks } from "./TemplateBlocks"
import { useTemplateStore } from "@/stores/TemplateStore"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ImageManager from "./ImageManager"
import { useWaitlistStore } from "@/stores/WaitlistStore"

export default function Toolbar() {
  const { template } = useTemplateStore()
  const { waitlist } = useWaitlistStore()
  const [tested, setTested] = useState(false)

  const sendTestEmail = async () => {
    if (template.blocks.length === 0) {
      toast.error("Email cannot be empty")
      return
    }

    try {
      const cleanedTemplate = {
        ...template,
        blocks: template.blocks.map(({ component, ...rest }) => rest),
      }

      const response = await fetch("/api/waitlists/emails/send-test", {
        method: "POST",
        body: JSON.stringify({
          template: cleanedTemplate,
          projectName: waitlist!.name,
          primaryColor: template.colors.primaryColor,
          secondaryColor: template.colors.secondaryColor,
          textColor: template.colors.textColor,
          accentColor: template.colors.accentColor,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send test email")
        return
      }
      setTested(true)
    } catch (error) {
      console.error(error)
      toast.error("Failed to send test email")
    }
  }

  return (
    <div className="w-full flex space-x-4 mb-6">
      <div className="w-full flex items-center justify-center bg-white border border-redorange-500 text-redorange-500 rounded hover:bg-redorange-500 hover:text-white transition duration-200">
        <ImageManager />
      </div>
      <div className="w-full flex items-center justify-center bg-white border border-redorange-500 text-redorange-500 rounded hover:bg-redorange-500 hover:text-white transition duration-200">
        <Sheet>
          <SheetTrigger className="w-full py-2">Add block</SheetTrigger>
          <SheetContent className="w-[50rem]" side="right">
            <SheetHeader>
              <SheetTitle>Template blocks</SheetTitle>
              <SheetDescription>Add a premade block to your email template and edit the content in the editor</SheetDescription>
            </SheetHeader>

            <div className="my-10 p-6 overflow-y-auto h-[85vh]">
              <div className="grid grid-cols-2 gap-4">
                {Object.values(TemplateBlocks).map((block) => (
                  <div
                    key={block.id}
                    className="relative flex border rounded flex-col items-center text-left space-y-3 cursor-pointer group"
                    onClick={() => useTemplateStore.getState().update({ ...template, blocks: [...template.blocks, block] })}
                  >
                    <Image
                      src={block.thumbnail}
                      alt={block.name}
                      width={1000}
                      height={1000}
                      className="w-full shadow rounded h-auto transition duration-200"
                    />
                    <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black bg-opacity-75 px-4 py-2 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {block.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full flex items-center justify-center bg-white border border-redorange-500 text-redorange-500 rounded hover:bg-redorange-500 hover:text-white transition duration-200">
        <AlertDialog>
          <AlertDialogTrigger>Send Test Email</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to send a test email?</AlertDialogTitle>
              <AlertDialogDescription>
                This will send a test email to the address associated with your account for you to preview the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={sendTestEmail}>Send</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        className={`w-full flex item-center justify-center bg-redorange-500 text-white rounded hover:bg-redorange-300 transition duration-200 ${
          tested ? "" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <AlertDialogTrigger className="w-full">
                <TooltipTrigger className="w-full py-2" disabled={!tested}>
                  Send Campaign
                </TooltipTrigger>
              </AlertDialogTrigger>
              <TooltipContent>
                <p>
                  {tested
                    ? "Send this email to your subscribers"
                    : "You must send yourself a test email before sending a live campaign"}
                </p>
              </TooltipContent>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to send this campaign?</AlertDialogTitle>
                  <AlertDialogDescription>This will send the email to all subscribers on your waitlist.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Send</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialog>
      </div>
    </div>
  )
}
