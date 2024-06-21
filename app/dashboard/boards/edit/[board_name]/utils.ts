export const themes = [
  {
    name: "Default Light",
    primaryColor: "#ffffff",
    secondaryColor: "#f3f4f6",
    accentColor: "#6366f1",
    textColor: "#000000",
  },
  {
    name: "Default Dark",
    primaryColor: "#0f172a",
    secondaryColor: "#334155",
    accentColor: "#f43f5e",
    textColor: "#f9fafb",
  },
  {
    name: "Theme 3",
    primaryColor: "#172554",
    secondaryColor: "#1e3a8a",
    accentColor: "#93c5fd",
    textColor: "#eff6ff",
  },
  {
    name: "Earth",
    primaryColor: "#F6E6CB",
    secondaryColor: "#E7D4B5",
    accentColor: "#55634b",
    textColor: "#2b2418",
  },
]

// change the label text color based on the rectangle background color
export const getTextColor = (backgroundColor: string) => {
  const hex = backgroundColor.replace("#", "")
  if (hex === "fff") return "text-black"
  if (hex === "000") return "text-white"
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 186 ? "text-black" : "text-white"
}
