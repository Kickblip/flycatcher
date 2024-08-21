import { IconType } from "react-icons/lib"

export default function StatCard({ title, stat, StatIcon }: { title: string; stat: string; StatIcon: IconType }) {
  return (
    <div className="flex flex-col rounded border w-full md:w-64 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md">{title}</h2>
        <StatIcon className="w-6 h-6 text-redorange-500" />
      </div>
      <p className="font-semibold text-3xl">{stat}</p>
    </div>
  )
}
