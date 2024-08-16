export default function BlockSettingWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="w-full rounded border p-6">
      <h1 className="text-md font-medium break-words mb-1 ">{title}</h1>
      <div className="mt-4">{children}</div>
    </div>
  )
}
