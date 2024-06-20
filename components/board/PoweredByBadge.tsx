import Image from "next/image"
import Link from "next/link"
import { getTextColor } from "../../app/dashboard/suggestions/edit/[board_name]/utils"

const PoweredByBadge = ({ primaryColor }: { primaryColor: string | undefined }) => {
  let textColor = "text-black"
  if (primaryColor) textColor = getTextColor(primaryColor)

  const logoPath = textColor === "text-black" ? "/board-pages/dark-logo.png" : "/board-pages/light-logo.png"

  return (
    <div className="text-center mt-2">
      <span className="text-xs block">Powered by</span>
      <Link href="https://flycatcher.app" target="_blank">
        <Image src={logoPath} alt="Flycatcher Logo" width={120} height={50} className="mx-auto" />
      </Link>
    </div>
  )
}

export default PoweredByBadge
