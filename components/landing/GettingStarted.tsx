import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, LinkIcon } from "@heroicons/react/24/outline"
import { Button } from "./ui/MovingBorder"
import Link from "next/link"

const suggestions = [
  {
    title: "Embed feedback boards in other apps",
    description:
      "I'd really like to be able to embed my feedback board directly onto my website. Maybe even let me authenticate with my own users?",
    likeCount: 243,
    commentCount: 78,
    status: "Currently in-progress...",
    liked: true,
  },
  {
    title: "Magic link logins",
    description: "I'd use your app if you had magic link or OAuth options... I don't want to make a password",
    likeCount: 139,
    commentCount: 13,
    status: "Planned",
    liked: true,
  },
  {
    title: "Landing page broken on mobile",
    description:
      "I'm using an iPhone 12 and the pricing section of your landing page is super squished and I can't read anything!",
    likeCount: 36,
    commentCount: 5,
    status: "Shipped!",
    liked: false,
  },
]

function GettingStarted() {
  return (
    <section className="w-full flex flex-col md:flex-row my-32">
      <div className="w-full md:w-1/2 p-4 text-center">
        <h2 className="text-5xl font-semibold mb-6">Get feedback. Not fluff</h2>
        <p className="">
          Name your board, pick your colors, upload your logo, and share it. No long setups, no headaches. Feedback is collected
          through a link you can share with your community.
        </p>
        <div className="flex flex-col items-center mt-4 md:mt-12">
          <Link href="/b/flycatcher" target="_blank" className="w-full">
            <Button borderRadius="0.75rem" className="bg-white border-fuchsia-500">
              <div className="flex items-center justify-center w-full font-bold text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text">
                <LinkIcon className="w-4 h-4 text-fuchsia-700 mr-2 text-lg" strokeWidth={2} />
                flycatcher.app/b/flycatcher
              </div>
            </Button>
          </Link>
          <Link href="/b/flycatcher" target="_blank" className="text-xs text-gray-500 mt-1 cursor-pointer">
            A link just like this one!
          </Link>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between pointer-events-none">
            <div className="flex flex-col break-words max-w-[70%]">
              <h2 className="text-xs font-semibold mb-2 text-indigo-500">{suggestion.status}</h2>
              <h2 className="text-lg font-bold mb-2">{suggestion.title}</h2>
              <p className="text-sm">{suggestion.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center justify-center w-12 h-20">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mb-1 text-gray-700" strokeWidth={2} />
                <span className="text-gray-700">{suggestion.commentCount}</span>
              </div>
              <div
                className={
                  "flex flex-col items-center justify-center w-12 h-20 rounded-lg " +
                  (suggestion.liked ? "text-white bg-indigo-500" : "text-indigo-500 border border-indigo-500")
                }
              >
                <HandThumbUpIcon className="w-5 h-5 mb-1" strokeWidth={2} />
                <span>{suggestion.likeCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GettingStarted
