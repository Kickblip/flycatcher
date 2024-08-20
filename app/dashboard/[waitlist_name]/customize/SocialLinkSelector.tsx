import { WaitlistPage } from "@/types/WaitlistPage"
import { IconType } from "react-icons/lib"

export default function SocialLinkSelector({
  pageWaitlist,
  setPageWaitlist,
  socialKey,
  SocialIcon,
  currentLink,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
  socialKey: string
  SocialIcon: IconType
  currentLink: string
}) {
  return (
    <div className="flex items-center border rounded">
      <div className="flex items-center p-2 border-r">
        <SocialIcon className="w-5 h-5 text-redorange-500" />
      </div>
      <input
        value={currentLink}
        type="text"
        onChange={(e) =>
          setPageWaitlist({
            ...pageWaitlist,
            socialLinks: {
              ...pageWaitlist.socialLinks,
              [socialKey]: e.target.value,
            },
          })
        }
        className="w-full text-sm p-2"
      />
    </div>
  )
}
