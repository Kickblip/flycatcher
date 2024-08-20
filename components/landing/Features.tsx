import FeatureCard from "./FeatureCard"
import { FaCalendarDays, FaChartSimple, FaPaperPlane } from "react-icons/fa6"

export default function Features() {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-5xl font-semibold mb-12">The tools you need</h2>
      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
        <FeatureCard
          title="Waitlist Pages"
          content="Get a waitlist that matches your brand. Personalize with your logo, colors, content, and metadata"
          FeatureIcon={FaCalendarDays}
        />
        <FeatureCard
          title="Analytics"
          content="Access real-time performance insights for your waitlist, including views, conversions, and user demographics"
          FeatureIcon={FaChartSimple}
        />
        <FeatureCard
          title="Email Marketing"
          content="Retain interest in your product and announce milestones by sending marketing campaigns to your subscribers"
          FeatureIcon={FaPaperPlane}
        />
      </div>
    </div>
  )
}
