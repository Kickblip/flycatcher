import { FaBoltLightning } from "react-icons/fa6"

export default function FullLogo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 text-white bg-redorange-500 rounded-md">
        <FaBoltLightning className="w-5 h-5" />
      </div>
      <h1 className="text-redorange-500 font-extrabold text-xl tracking-wide">WAITLIST BUILDER</h1>
    </div>
  )
}
