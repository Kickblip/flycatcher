import tinycolor from "tinycolor2"

function BoardPreviewPanel({
  primaryColor,
  secondaryColor,
  accentColor,
  textColor,
}: {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
}) {
  const lighterSecondaryColor = tinycolor(secondaryColor).lighten(20).toString()
  return (
    <div className="flex justify-center h-full rounded-lg p-8" style={{ backgroundColor: primaryColor, color: textColor }}>
      <div className="flex flex-col p-4 space-y-8 rounded-lg w-96 h-[28rem]" style={{ backgroundColor: secondaryColor }}>
        <h2 className="text-xl font-bold opacity-80">Suggestion Board Preview</h2>
        <div className="flex flex-col">
          <label className="block text-sm font-bold mb-2" htmlFor="previewTitle">
            Title
          </label>
          <input
            type="text"
            id="previewTitle"
            value="Please add a dark mode!!!!"
            className="w-full p-2 rounded-lg"
            style={{ backgroundColor: lighterSecondaryColor }}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-bold mb-2" htmlFor="previewDescription">
            Description
          </label>
          <textarea
            id="previewDescription"
            value={
              "It burns my eyes to use your website when I'm in bed at night. Please add a dark mode so I can use it without going blind."
            }
            className="w-full p-2 rounded-lg"
            style={{ backgroundColor: lighterSecondaryColor, height: "150px" }}
            disabled
          />
        </div>
        <button className="w-full p-2 rounded-lg" style={{ backgroundColor: accentColor, color: secondaryColor }} disabled>
          Submit
        </button>
      </div>
    </div>
  )
}

export default BoardPreviewPanel
