import { Field, WaitlistPage } from "@/types/WaitlistPage"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"

export default function FieldSelector({
  pageWaitlist,
  setPageWaitlist,
  field,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
  field: Field
}) {
  const expandedHeight = "85px"
  const collapsedHeight = "50px"

  return (
    <motion.div
      className="flex flex-col border rounded shadow py-3 px-4 space-y-2"
      initial={{ height: collapsedHeight }}
      animate={{ height: field.enabled ? expandedHeight : collapsedHeight }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium break-words mb-1">{field.label}</p>
        <Switch
          checked={field.enabled}
          onCheckedChange={() => {
            setPageWaitlist({
              ...pageWaitlist,
              fields: pageWaitlist.fields.map((f) => {
                if (f.label === field.label) {
                  return {
                    ...f,
                    enabled: !f.enabled,
                    required: f.enabled ? false : f.required,
                  }
                }
                return f
              }),
            })
          }}
        />
      </div>
      {field.enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-xs text-gray-700 break-words">Required</p>
          <Switch
            checked={field.required}
            onCheckedChange={() => {
              setPageWaitlist({
                ...pageWaitlist,
                fields: pageWaitlist.fields.map((f) => {
                  if (f.label === field.label) {
                    return {
                      ...f,
                      required: !f.required,
                    }
                  }
                  return f
                }),
              })
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
