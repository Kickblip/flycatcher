import { Comment, Board, Suggestion } from "@/types/SuggestionBoard"
import { useState } from "react"
import TextBlock from "./TextBlock"
import { FaLocationArrow } from "react-icons/fa6"
import { User } from "@supabase/supabase-js"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function CommentCard({
  comment,
  suggestion,
  board,
  setBoard,
  user,
  setSignInModalIsOpen,
}: {
  comment: Comment
  suggestion: Suggestion
  board: Board
  setBoard: (board: Board) => void
  user: User | null
  setSignInModalIsOpen: (isOpen: boolean) => void
}) {
  const [reply, setReply] = useState("")
  const [replySubmitting, setReplySubmitting] = useState(false)

  const newReplySubmit = async () => {
    setReply(reply.trim())

    if (!reply) return

    if (!user?.id) {
      setSignInModalIsOpen(true)
      return
    }

    if (reply.length > 350) {
      toast.error("Reply must be less than 350 characters")
      return
    }

    setReplySubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/add-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply,
          commentId: comment.id,
          suggestionId: suggestion.id,
          boardUrlName: board.urlName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add Reply.")
      } else {
        const data = await response.json()
        comment.replies.push(data.newReply)
        setReply("")
        toast.success("Reply added.")
      }
    } catch (error) {
      console.error((error as Error).message || "Failed to add Reply.")
      toast.error("Failed to add Reply.")
    } finally {
      setReplySubmitting(false)
    }
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-full">
      <TextBlock
        authorImg={comment.authorImg}
        authorName={comment.authorName}
        content={comment.content}
        isOwnerMessage={comment.isOwnerMessage}
      />
      <div className="ml-4 mt-4 flex flex-col space-y-4">
        {comment.replies.map((reply) => (
          <TextBlock
            key={reply.id}
            authorImg={reply.authorImg}
            authorName={reply.authorName}
            content={reply.content}
            isOwnerMessage={reply.isOwnerMessage}
          />
        ))}
      </div>
      <div className="relative w-full mt-4">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full border rounded px-4 py-2 pr-10"
          placeholder="Add a reply..."
        />
        <button
          onClick={newReplySubmit}
          className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-indigo-500 text-white rounded-r"
        >
          <FaLocationArrow className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
