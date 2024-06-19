function PremadeThemeSquare({
  theme,
  index,
  applyPremadeTheme,
}: {
  theme: {
    name: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    textColor: string
  }
  index: number
  applyPremadeTheme: (theme: any) => void
}) {
  return (
    <div key={index} className="rounded-lg cursor-pointer" onClick={() => applyPremadeTheme(theme)}>
      <div className="flex w-full h-32 rounded-lg overflow-hidden">
        <div className="flex-1" style={{ backgroundColor: theme.primaryColor }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.secondaryColor }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.accentColor }}></div>
        <div className="flex-1" style={{ backgroundColor: theme.textColor }}></div>
      </div>
    </div>
  )
}

export default PremadeThemeSquare
