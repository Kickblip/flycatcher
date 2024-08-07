"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Suggestion, Board, LocalStorageUser } from "@/types/SuggestionBoard"
import { Project } from "@/types/Project"
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid"
import tinycolor from "tinycolor2"
import Modal from "react-modal"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@/hooks/supabase"
import SignInForm from "@/components/shared/SignInForm"

function SuggestionCard({
  suggestion,
  boardData,
  projectData,
}: {
  suggestion: Suggestion
  boardData: Board
  projectData: Project
}) {
  const { primaryColor, secondaryColor, accentColor, textColor } = projectData.settings
  const lighterSecondaryColor = secondaryColor ? tinycolor(secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const lighterTextColor = textColor ? tinycolor(textColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: boolean }>({})
  const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({})
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [editing, setEditing] = useState(false)
  const [suggestionTitle, setSuggestionTitle] = useState("")
  const [suggestionDescription, setSuggestionDescription] = useState("")
  const [previousSuggestionTitle, setPreviousSuggestionTitle] = useState("")
  const [previousSuggestionDescription, setPreviousSuggestionDescription] = useState("")
  const { user, stripeData, error } = useUser()
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth))
    return () => {
      window.removeEventListener("resize", () => setScreenWidth(window.innerWidth))
    }
  }, [])

  useEffect(() => {
    if (suggestion && suggestion.title && suggestion.description) {
      setSuggestionTitle(suggestion.title)
      setSuggestionDescription(suggestion.description)
    }
  }, [suggestion])

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: primaryColor,
      color: textColor,
      padding: "20px",
      borderRadius: "7px",
      border: "0px",
      width: screenWidth <= 640 ? "95%" : screenWidth <= 768 ? "90%" : "50%",
      maxHeight: "90vh",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    if (newComment.length > 350) {
      toast.error("Comment must be less than 350 characters")
      return
    }

    if (!user?.id) {
      setSignInModalIsOpen(true)
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment, suggestionId: suggestion.id, board: boardData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        const data = await response.json()
        suggestion.comments.push(data.newComment)
        toast.success("Comment added.")
      }

      setNewComment("")
    } catch (error) {
      console.error((error as Error).message || "Failed to add comment")
      toast.error("Failed to add comment.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddReply = (index: number) => {
    setReplyInputs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleReplyChange = (index: number, value: string) => {
    setReplyTexts((prev) => ({
      ...prev,
      [index]: value,
    }))
  }

  const handleReplySubmit = async (index: number, commentId: string) => {
    const replyText = replyTexts[index].trim()

    if (!replyText || !commentId) return

    if (!user?.id) {
      setSignInModalIsOpen(true)
      return
    }

    if (replyText.length > 350) {
      toast.error("Reply must be less than 350 characters")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/add-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: replyText,
          commentId: commentId,
          suggestionId: suggestion.id,
          boardUrlName: boardData.urlName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add Reply.")
      } else {
        const data = await response.json()
        suggestion.comments[index].replies.push(data.newReply)
        setReplyTexts((prev) => ({
          ...prev,
          [index]: "",
        }))
        setReplyInputs((prev) => ({
          ...prev,
          [index]: false,
        }))
        toast.success("Reply added.")
      }
    } catch (error) {
      console.error((error as Error).message || "Failed to add Reply.")
      toast.error("Failed to add Reply.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleVoteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    setSubmitting(true)

    // set author id depending on if user is signed in or not
    const localStorageData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let author = user?.id ? user?.id : localStorageData?.id

    if (isLiked) {
      let temp = suggestion.votes.pop()
      setIsLiked(false)
      // prechange local state
      const index = localStorageData.likedSuggestions.indexOf(suggestion.id)
      if (index > -1) {
        localStorageData.likedSuggestions.splice(index, 1)
      }
      localStorage.setItem("user", JSON.stringify(localStorageData))

      try {
        const response = await fetch("/api/pub/boards/remove-vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ suggestionId: suggestion.id, board: boardData, author: author }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to remove vote")
        } else {
          const data = await response.json()
        }
      } catch (error) {
        console.error("Error removing vote:", error)
        toast.error("Failed to remove vote.")

        // revert changes
        if (temp) suggestion.votes.push(temp)
        setIsLiked(true)
        localStorageData.likedSuggestions.push(suggestion.id)
        localStorage.setItem("user", JSON.stringify(localStorageData))
      } finally {
        setSubmitting(false)
      }
    } else {
      // prechange local state
      suggestion.votes.push({ author: "" }) // local state doesnt need a real vote object - just something to keep count accurate
      setIsLiked(true)
      localStorageData.likedSuggestions.push(suggestion.id)
      localStorage.setItem("user", JSON.stringify(localStorageData))

      try {
        const response = await fetch("/api/pub/boards/add-vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ suggestionId: suggestion.id, board: boardData, author: author }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to add vote")
        }
      } catch (error) {
        console.error("Error adding vote:", error)

        // revert changes
        toast.error("Failed to add vote.")
        suggestion.votes.pop()
        setIsLiked(false)

        const index = localStorageData.likedSuggestions.indexOf(suggestion.id)
        if (index > -1) {
          localStorageData.likedSuggestions.splice(index, 1)
        }
        localStorage.setItem("user", JSON.stringify(localStorageData))
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleEditSave = async () => {
    // check if title or description has changed
    if (
      suggestionTitle.trim() === previousSuggestionTitle.trim() &&
      suggestionDescription.trim() === previousSuggestionDescription.trim()
    ) {
      setEditing(false)
      return
    }

    if (suggestionTitle.length > 250) {
      toast.error("Title must be less than 250 characters")
      return
    }
    if (suggestionDescription.length > 500) {
      toast.error("Description must be less than 500 characters")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/edit-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestionId: suggestion.id,
          title: suggestionTitle,
          description: suggestionDescription,
          boardUrlName: boardData.urlName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to edit suggestion.")
      } else {
        setEditing(false)
        toast.success("Suggestion edited.")
      }
    } catch (error) {
      console.error("Error editing suggestion:", error)
      toast.error("Failed to edit suggestion.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section
        className="w-full mb-4 p-4 rounded-lg cursor-pointer"
        style={{ backgroundColor: secondaryColor }}
        onClick={() => setModalIsOpen(true)}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col break-words max-w-[72%] md:max-w-[80%]" style={{ color: textColor }}>
            <h2 className="text-xs font-semibold mb-2" style={{ color: accentColor }}>
              {suggestion.status === "working"
                ? "Currently in-progress..."
                : suggestion.status === "shipped"
                ? "Shipped!"
                : suggestion.status === "done"
                ? "Ready for next release"
                : suggestion.status === "todo"
                ? "Planned"
                : ""}
            </h2>
            <h2 className="text-lg font-bold mb-2">{suggestionTitle}</h2>
            <p className="text-sm">{suggestionDescription}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-12 h-20" style={{ color: textColor }}>
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <span className="text-sm">{suggestion.comments.length}</span>
            </div>
            <button
              className={`flex flex-col items-center justify-center w-12 h-20 rounded-lg ${
                isLiked ? "bg-accent text-secondary" : "border"
              }`}
              style={{
                backgroundColor: isLiked ? accentColor : "transparent",
                color: isLiked ? secondaryColor : accentColor,
                borderColor: !isLiked ? accentColor : "transparent",
                borderWidth: !isLiked ? "1px" : "0px",
                borderStyle: !isLiked ? "solid" : "none",
              }}
              onClick={handleVoteClick}
              disabled={submitting}
            >
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <HandThumbUpIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-sm">{suggestion.votes.length}</span>
            </button>
          </div>
        </div>
      </section>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="Suggestion Comments Modal"
      >
        <div className="p-4 w-full">
          <div className="mb-4 w-full break-words flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:mb-4 mb-2">
              <div className="flex items-center order-2 md:order-1">
                <h2 className="text-sm font-semibold" style={{ color: accentColor }}>
                  {suggestion.status === "working"
                    ? "Currently in-progress..."
                    : suggestion.status === "shipped"
                    ? "Shipped!"
                    : suggestion.status === "done"
                    ? "Ready for next release"
                    : suggestion.status === "todo"
                    ? "Planned"
                    : ""}
                </h2>
                <p
                  className={`text-sm font-semibold ${
                    suggestion.status === "working" ||
                    suggestion.status === "shipped" ||
                    suggestion.status === "done" ||
                    suggestion.status === "todo"
                      ? "ml-2"
                      : ""
                  }`}
                  style={{ color: lighterTextColor }}
                >
                  {suggestion.updatedAt
                    ? `Edited at ${new Date(suggestion.updatedAt).toLocaleDateString()}`
                    : `${new Date(suggestion.createdAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex order-1 md:order-2 md:mb-0 mb-2 items-center">
                {suggestion.author ? (
                  editing ? (
                    <button // save button
                      onClick={handleEditSave}
                      disabled={submitting}
                    >
                      <CheckCircleIcon className="w-6 h-6 mr-2" />
                    </button>
                  ) : (
                    <button // edit button
                      onClick={() => {
                        setEditing(true)
                        setPreviousSuggestionTitle(suggestionTitle)
                        setPreviousSuggestionDescription(suggestionDescription)
                      }}
                      disabled={submitting}
                    >
                      <PencilSquareIcon className="w-5 h-5 mr-2" />
                    </button>
                  )
                ) : (
                  <></>
                )}

                <Image
                  src={suggestion.authorImg || "/board-pages/default-pfp.png"}
                  alt="Author"
                  width={500}
                  height={500}
                  className="rounded-full object-cover w-7 h-7"
                />
                <p className="text-xs ml-2" style={{ color: textColor }}>
                  {suggestion.authorName || "Anonymous"}
                </p>
              </div>
            </div>
            {editing ? (
              <>
                <textarea
                  className="text-2xl font-bold mb-4 mt-1 cursor-text outline-none rounded-lg w-full break-words"
                  style={{ backgroundColor: editing ? lighterSecondaryColor : "transparent" }}
                  value={suggestionTitle}
                  onChange={(e) => setSuggestionTitle(e.target.value)}
                  disabled={!editing}
                  rows={1}
                />
                <textarea
                  className="text-lg cursor-text outline-none rounded-lg break-words w-full"
                  style={{ backgroundColor: editing ? lighterSecondaryColor : "transparent" }}
                  value={suggestionDescription}
                  onChange={(e) => setSuggestionDescription(e.target.value)}
                  disabled={!editing}
                  rows={3}
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 mt-1">{suggestionTitle}</h2>{" "}
                <p className="text-lg mb-4">{suggestionDescription}</p>
              </>
            )}
            {suggestion.imageUrls[0] ? (
              <Image
                src={suggestion.imageUrls[0]}
                alt="Image attachment"
                width={500}
                height={500}
                className="object-contain w-full max-h-96"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="mb-12 mt-6">
            <h3 className="text-md font-bold mb-2">Comments</h3>
            <div className="mb-4 flex">
              <input
                type="text"
                className="flex-grow px-2 py-1 border-b-2 bg-transparent outline-none"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value)
                }}
                style={{ borderColor: lighterTextColor, color: textColor }}
              />
              <button
                onClick={handleAddComment}
                className="ml-2 px-4 py-1 rounded-lg items-center justify-center flex"
                style={{ backgroundColor: accentColor, color: secondaryColor }}
                disabled={submitting}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div key={index} className="w-full flex flex-col mb-1 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Image
                      src={comment.authorImg || "/board-pages/default-pfp.png"}
                      alt="Author"
                      width={500}
                      height={500}
                      className="rounded-full object-cover w-6 h-6"
                    />
                    <p className="text-xs mx-2" style={{ color: textColor }}>
                      {comment.authorName || "Anonymous"}
                    </p>
                    {comment.isOwnerMessage ? (
                      <p
                        className="px-2 py-0.5 rounded text-xs font-semibold mr-2"
                        style={{ backgroundColor: accentColor, color: primaryColor }}
                      >
                        Board Owner
                      </p>
                    ) : (
                      <> </>
                    )}
                    <p className="text-xs break-words" style={{ color: lighterTextColor }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    {/* {comment.author ? (
                      <button>
                        <PencilSquareIcon className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <></>
                    )} */}
                  </div>
                  <p className="text-sm break-words mt-2 mb-1" style={{ color: textColor }}>
                    {comment.content}
                  </p>
                  <button className="flex items-center my-1" onClick={() => handleAddReply(index)} style={{ color: accentColor }}>
                    <p className="text-xs">Reply</p>
                    <ArrowsRightLeftIcon className="w-3 h-3 ml-1" strokeWidth={1.5} />
                  </button>
                  {replyInputs[index] && (
                    <div className="flex items-center my-2">
                      <input
                        type="text"
                        placeholder="Add a reply..."
                        className="flex-grow px-2 py-1 bg-transparent outline-none border-b-2"
                        style={{ borderColor: lighterTextColor }}
                        value={replyTexts[index] || ""}
                        onChange={(e) => handleReplyChange(index, e.target.value)}
                      />
                      <button
                        className="ml-2 rounded-lg px-4 py-2"
                        onClick={() => handleReplySubmit(index, comment.id)}
                        disabled={submitting}
                        style={{ color: secondaryColor, backgroundColor: accentColor }}
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  <div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-4 border-l-2 pl-2" style={{ borderColor: lighterTextColor }}>
                        {comment.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} className="mb-2">
                            <div className="flex items-center mb-1">
                              <Image
                                src={reply.authorImg || "/board-pages/default-pfp.png"}
                                alt="Author"
                                width={500}
                                height={500}
                                className="rounded-full object-cover w-5 h-5"
                              />
                              <p className="text-xs mx-2" style={{ color: textColor }}>
                                {reply.authorName || "Anonymous"}
                              </p>
                              {reply.isOwnerMessage ? (
                                <p
                                  className="px-2 py-0.5 rounded text-xs font-semibold mr-2"
                                  style={{ backgroundColor: accentColor, color: primaryColor }}
                                >
                                  Board Owner
                                </p>
                              ) : (
                                <> </>
                              )}
                              <p className="text-xs break-words" style={{ color: lighterTextColor }}>
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </p>
                              {/* {reply.author ? (
                                <button>
                                  <PencilSquareIcon className="w-4 h-4 ml-2" />
                                </button>
                              ) : (
                                <></>
                              )} */}
                            </div>
                            <p className="text-sm w-full break-words" style={{ color: textColor }}>
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: textColor }}>
                No comments yet.
              </p>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={signInModalIsOpen}
        onRequestClose={() => {
          setSignInModalIsOpen(false)
        }}
        contentLabel="Sign In Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            boxShadow: "none",
          },
        }}
      >
        <SignInForm redirectUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/b/${boardData?.urlName}`} />
      </Modal>
    </>
  )
}

export default SuggestionCard
