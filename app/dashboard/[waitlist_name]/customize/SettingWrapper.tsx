export default function SettingWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="w-full rounded border p-6">
      <div className="w-full">
        <h1 className="text-md font-medium break-words mb-1">{title}</h1>
        <p className="text-xs text-gray-700 break-words">{subtitle}</p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
