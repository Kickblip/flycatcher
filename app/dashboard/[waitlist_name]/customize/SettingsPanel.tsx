import { WaitlistPage } from "@/types/WaitlistPage"
import { FaXTwitter, FaYoutube, FaLinkedin, FaInstagram, FaSquareFacebook, FaTiktok } from "react-icons/fa6"
import SettingWrapper from "./SettingWrapper"
import ColorSelector from "./ColorSelector"
import EditTextForm from "./EditTextForm"
import SmallImageUpload from "./SmallImageUpload"
import LargeImageUpload from "./LargeImageUpload"
import SocialLinkSelector from "./SocialLinkSelector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <EditTextForm
            label="Button"
            textKey="submitButtonText"
            content={pageWaitlist.settings.submitButtonText}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SocialLinkSelector
            socialKey="twitter"
            SocialIcon={FaXTwitter}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.twitter}
          />
          <SocialLinkSelector
            socialKey="youtube"
            SocialIcon={FaYoutube}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.youtube}
          />
          <SocialLinkSelector
            socialKey="tiktok"
            SocialIcon={FaTiktok}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.tiktok}
          />
          <SocialLinkSelector
            socialKey="instagram"
            SocialIcon={FaInstagram}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.instagram}
          />
          <SocialLinkSelector
            socialKey="facebook"
            SocialIcon={FaSquareFacebook}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.facebook}
          />
          <SocialLinkSelector
            socialKey="linkedin"
            SocialIcon={FaLinkedin}
            pageWaitlist={pageWaitlist}
            setPageWaitlist={setPageWaitlist}
            currentLink={pageWaitlist.socialLinks.linkedin}
          />
        </div>
      </SettingWrapper>
      <SettingWrapper title="Disable Flycatcher Branding" subtitle="Remove the powered by badge from your waitlist public view">
        <div className="flex items-center space-x-2 mb-4 mt-4">
          <Switch
            id="disabled-branding"
            checked={pageWaitlist.settings.disableBranding}
            onCheckedChange={() => {
              if (!pageWaitlist.authorIsPremium) {
                setPageWaitlist({
                  ...pageWaitlist,
                  settings: {
                    ...pageWaitlist.settings,
                    disableBranding: false,
                  },
                })
                toast.error("This is a premium feature")
                return
              }
              setPageWaitlist({
                ...pageWaitlist,
                settings: {
                  ...pageWaitlist.settings,
                  disableBranding: !pageWaitlist.settings.disableBranding,
                },
              })
            }}
          />
          <Label htmlFor="disabled-branding">
            {pageWaitlist.settings.disableBranding ? "Branding disabled" : "Branding enabled"}
          </Label>
        </div>
      </SettingWrapper>
    </div>
  )
}
