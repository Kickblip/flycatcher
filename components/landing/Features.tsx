import FeatureCard from "./FeatureCard"
import { FaCalendarDays, FaChartSimple, FaPaperPlane } from "react-icons/fa6"

export default function Features() {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-5xl font-semibold mb-6">Features</h2>
      <div className="flex items-center space-x-8">
        <FeatureCard
          title="Waitlist Pages"
          content="Create a waitlist page and fully customize it for your brand in minutes"
          FeatureIcon={FaCalendarDays}
        />
        <FeatureCard
          title="Analytics"
          content="Get live performance data for your waitlist, including views, conversions, and demographics"
          FeatureIcon={FaChartSimple}
        />
        <FeatureCard
          title="Email Marketing"
          content="Send email marketing campaigns to your subscribers to retain interest in your product"
          FeatureIcon={FaPaperPlane}
        />
      </div>
    </div>
  )
}
