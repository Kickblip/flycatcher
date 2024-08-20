import EmailForm from "./EmailForm"

export default function Unsubscribe({ params }: { params: { waitlist_name: string } }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <EmailForm urlName={params.waitlist_name} />
    </div>
  )
}
