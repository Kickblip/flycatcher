"use client"

import { useWaitlistStore } from "@/stores/WaitlistStore"
import { DataTable } from "./DataTable"
import { createColumns } from "./columns"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Contacts() {
  const { waitlist } = useWaitlistStore()

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  const removeContact = async (contactId: string) => {
    try {
      const response = await fetch("/api/waitlists/delete-contact", {
        method: "POST",
        body: JSON.stringify({ urlName: waitlist.urlName, contactId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete contact")
      }

      const pageWaitlist = { ...waitlist }
      pageWaitlist.contacts = pageWaitlist.contacts.filter((contact) => contact.id !== contactId)
      useWaitlistStore.getState().update(pageWaitlist)
      toast.success("Contact deleted")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete contact")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={createColumns(removeContact)} data={waitlist.contacts} />
    </div>
  )
}
