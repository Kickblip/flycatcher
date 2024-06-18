import Link from "next/link"

export default function Page() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex space-x-3">
          <Link href="/protected" className="text-stone-400 underline hover:text-stone-200 transition-all">
            Protected Page
          </Link>
        </div>
      </div>
    </div>
  )
}
