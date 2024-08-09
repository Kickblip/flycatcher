import { WaitlistPage } from "@/types/WaitlistPage"
import SettingWrapper from "./SettingWrapper"
import ColorSelector from "./ColorSelector"
import EditTextForm from "./EditTextForm"
import SmallImageUpload from "./SmallImageUpload"
import LargeImageUpload from "./LargeImageUpload"

export default function SettingsPanel({
  pageWaitlist,
  setPageWaitlist,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
}) {
  return (
    <div className="w-full flex flex-col space-y-6">
      <SettingWrapper title="Colors" subtitle="Update the color scheme for your waitlist">
        <div className="grid grid-cols-2 gap-4">
          <ColorSelector
            color={pageWaitlist.settings.primaryColor}
            setPageWaitlist={setPageWaitlist}
            pageWaitlist={pageWaitlist}
            colorKey={"primaryColor"}
          />
          <ColorSelector
            color={pageWaitlist.settings.textColor}
            setPageWaitlist={setPageWaitlist}
            pageWaitlist={pageWaitlist}
            colorKey={"textColor"}
          />
          <ColorSelector
            color={pageWaitlist.settings.secondaryColor}
            setPageWaitlist={setPageWaitlist}
            pageWaitlist={pageWaitlist}
            colorKey={"secondaryColor"}
          />
          <ColorSelector
            color={pageWaitlist.settings.accentColor}
            setPageWaitlist={setPageWaitlist}
            pageWaitlist={pageWaitlist}
            colorKey={"accentColor"}
          />
        </div>
      </SettingWrapper>

      <SettingWrapper title="Fields" subtitle="Select the information you want to collect in your waitlist form">
        <div className="h-32"></div>
      </SettingWrapper>

      <SettingWrapper title="Copy" subtitle="Edit the header and subheader text that is displayed on the waitlist">
        <div className="flex flex-col space-y-4">
          <EditTextForm
            label="Title"
            textKey="titleText"
            content={pageWaitlist.settings.titleText}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
          />
          <EditTextForm
            label="Subtitle"
            textKey="subtitleText"
            content={pageWaitlist.settings.subtitleText}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
          />
        </div>
      </SettingWrapper>

      <SettingWrapper title="Metadata" subtitle="Edit the tab title and add a favicon image">
        <div className="flex flex-col space-y-4">
          <EditTextForm
            label="Tab title"
            textKey="metadataTabTitle"
            content={pageWaitlist.settings.metadataTabTitle}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
          />
          <SmallImageUpload
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            endpoint="waitlistFavicon"
            imageKey="favicon"
          />
        </div>
      </SettingWrapper>

      <SettingWrapper title="Preview Image" subtitle="Add a preview image to the waitlist page to display your product">
        <LargeImageUpload
          pageWaitlist={pageWaitlist}
          setPageWaitlist={setPageWaitlist}
          endpoint="waitlistPreview"
          imageKey="preview"
        />
      </SettingWrapper>

      <SettingWrapper title="Logo" subtitle="Add a logo image to be displayed above the title">
        <SmallImageUpload pageWaitlist={pageWaitlist} setPageWaitlist={setPageWaitlist} endpoint="waitlistLogo" imageKey="logo" />
      </SettingWrapper>

      <SettingWrapper title="Additional Links" subtitle="Add social media links that you would like to be displayed on the page">
        <div className="h-32"></div>
      </SettingWrapper>
    </div>
  )
}
