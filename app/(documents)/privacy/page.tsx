import Navbar from "@/components/landing/Navbar"
import Link from "next/link"

export default function Privacy() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

      <div className="w-full max-w-7xl mx-auto p-4 mb-24">
        <strong>Last Updated: 06-23-2024</strong>
        <p>
          This Privacy Policy covers how Flycatcher ("we," "us," or "our") manages your personal and non-personal information.
          This primarily includes data gathered from your usage of our website,{" "}
          <Link href="https://flycatcher.app/" className="text-blue-500 underline">
            https://flycatcher.app/
          </Link>
          . By using Flycatcher, you agree to the terms of this Privacy Policy.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">1. Personal Data</h2>
        <p>
          We collect your email address to create your account, manage your subscriptions, and personalize your account. We also
          collect payment information (if you make a purchase) to process your subscription, but do not store it on our servers.
          We use Stripe to process payments and store all your payment information. You can find their privacy policy{" "}
          <Link href="https://stripe.com/privacy" className="text-blue-500 underline">
            here
          </Link>
          .
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">2. Non-Personal Data</h2>
        <p>
          We may use basic analytics such as page views, browser type, and other device details. This data helps us analyze trends
          and improve our services. We do not use cookies on Flycatcher.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">3. Purpose of Data Collection</h2>
        <p>
          We collect and use your personal data to provide our services and allow you to access and use the website. We collect
          and use payment information to process your subscription (if you decide to sign up for a paid subscription).
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">4. Personal Data Sharing</h2>
        <p>
          We do not share your personal data with any third parties except as required for payment processing or our own email
          marketing.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">5. Children's Data</h2>
        <p>
          Flycatcher is not intended for users under the age of 18. We do not knowingly collect personal information from
          children. If you have any concerns regarding the data of a child, please contact us at the email address provided below.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">6. Updates and Contact</h2>
        <p>
          Updates to this Privacy Policy will be reflected on this page, major changes may be communicated to the email associated
          with your account. For any questions or concerns, please contact us at flycatcherapp@gmail.com
        </p>
      </div>
    </main>
  )
}
