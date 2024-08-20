import Link from "next/link"

export default function FlycatcherBadge({ textColor }: { textColor: string }) {
  return (
    <div className="text-center">
      <Link href="https://flycatcher.app" target="_blank">
        <p className="text-sm font-medium" style={{ color: textColor }}>
          Built with <span className="underline">Flycatcher</span>
        </p>
      </Link>
    </div>
  )
}
