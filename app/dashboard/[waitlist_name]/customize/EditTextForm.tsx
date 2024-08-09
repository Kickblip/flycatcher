import { WaitlistPage } from "@/types/WaitlistPage"

export default function EditTextForm({
  label,
  textKey,
  content,
  pageWaitlist,
  setPageWaitlist,
}: {
  label: string
  textKey: string
  content: string
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
}) {
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium break-words mb-1">{label}</h1>
      <input
        value={content}
        type="text"
        onChange={(e) =>
          setPageWaitlist({
            ...pageWaitlist,
            settings: {
              ...pageWaitlist.settings,
              [textKey]: e.target.value,
            },
          })
        }
        className="w-full text-sm p-2 border rounded"
      />
    </div>
  )
}
