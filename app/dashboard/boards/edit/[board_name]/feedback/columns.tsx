"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Suggestion, Board, Tag } from "@/types/SuggestionBoard"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { statuses, priorities, Status, Priority } from "./utils"
import { ChatBubbleLeftRightIcon, HandThumbUpIcon, TrashIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ComboboxPopover } from "./ComboboxPopover"
import { PriorityComboboxPopover } from "./PriorityComboboxPopover"

const tagFilterFn = (row: Row<any>, columnId: string, filterValue: string[]) => {
  const rowValue = row.getValue(columnId) as Tag[]
  return filterValue.some((filter: string) => rowValue.map((tag) => tag.label).includes(filter))
}

const includesString = (row: Row<any>, columnId: string, filterValue: string | string[]) => {
  const value = row.getValue(columnId)
  if (Array.isArray(filterValue)) {
    return filterValue.some((val) => String(value).toLowerCase().includes(String(val).toLowerCase()))
  }
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
}

export const createColumns = (
  board: Board,
  onSuggestionClick: (suggestion: Suggestion) => void,
  setBoard: (board: any) => void,
): ColumnDef<Suggestion>[] => [
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                onSuggestionClick(row.original)
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(row.original.title)
                toast.success("Title copied to clipboard!")
              }}
            >
              Copy title
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="relative font-normal flex cursor-pointer items-center select-none rounded-sm text-sm px-2 py-1.5 outline-none transition-colors hover:bg-gray-100 duration-200 text-red-500 space-x-1">
                  <TrashIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <div>Delete</div>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This suggestion will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/boards/delete-suggestion`, {
                          method: "POST",
                          body: JSON.stringify({ suggestionId: row.original.id, boardName: board.urlName }),
                        })

                        if (!response.ok) {
                          const errorData = await response.json()
                          throw new Error(errorData.message || "Board does not exist")
                        }

                        setBoard((prevBoard: Board) => ({
                          ...prevBoard,
                          suggestions: prevBoard.suggestions.filter((s) => s.id !== row.original.id),
                        }))
                        toast.success("Feedback deleted.")
                      } catch (error) {
                        console.error("Error deleting feedback:", error)
                        toast.error("Failed to delete feedback.")
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const tags = row.original.tags
      const displayedTags = tags.slice(0, 2)
      const remainingTagsCount = tags.length - displayedTags.length

      return (
        <div
          className="flex items-center space-x-2 w-[450px] cursor-pointer"
          onClick={() => {
            onSuggestionClick(row.original)
          }}
        >
          {displayedTags.map((tag: Tag) => (
            <span
              key={tag.label}
              className="text-xs px-2 py-1 rounded-lg border"
              style={{
                color: tag.primaryColor,
                backgroundColor: tag.secondaryColor,
                borderColor: tag.primaryColor,
              }}
            >
              {tag.label}
            </span>
          ))}
          {remainingTagsCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-lg border text-gray-700">+{remainingTagsCount} more</span>
          )}
          <span className="truncate font-medium">{row.getValue("title")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "votes.length",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Votes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center space-x-1">
          <div>{row.original.votes.length}</div>
          <HandThumbUpIcon className="h-3.5 w-3.5" strokeWidth={1.7} />
        </div>
      )
    },
  },
  {
    accessorKey: "comments.length",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Comments
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center space-x-1">
          <div>{row.original.comments.length}</div>
          <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" strokeWidth={1.7} />
        </div>
      )
    },
  },
  {
    accessorKey: "priority",
    filterFn: includesString,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const priority = row.original.priority
      const selectedPriority = priorities.find((s) => s.value === priority)

      const handlePriorityChange = async (newPriority: Priority) => {
        if (!newPriority) return
        try {
          const response = await fetch(`/api/boards/update-suggestion-priority`, {
            method: "POST",
            body: JSON.stringify({ priority: newPriority.value, suggestionId: row.original.id, boardName: board.urlName }),
          })
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Board does not exist")
          }
          setBoard((prevBoard: Board) => ({
            ...prevBoard,
            suggestions: prevBoard.suggestions.map((s) => (s.id === row.original.id ? { ...s, priority: newPriority.value } : s)),
          }))
        } catch (error) {
          console.error("Error updating suggestion priority:", error)
          toast.error("Failed to update suggestion priority.")
        }
      }

      return (
        <div className="flex items-center space-x-1">
          <PriorityComboboxPopover currentPriority={selectedPriority || null} onPriorityChange={handlePriorityChange} />
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    filterFn: includesString,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status
      const selectedStatus = statuses.find((s) => s.value === status)

      const handleStatusChange = async (newStatus: Status) => {
        if (!newStatus) return
        try {
          const response = await fetch(`/api/boards/update-suggestion-status`, {
            method: "POST",
            body: JSON.stringify({ status: newStatus.value, suggestionId: row.original.id, boardName: board.urlName }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Board does not exist")
          }

          setBoard((prevBoard: Board) => ({
            ...prevBoard,
            suggestions: prevBoard.suggestions.map((s) => (s.id === row.original.id ? { ...s, status: newStatus.value } : s)),
          }))
        } catch (error) {
          console.error("Error updating suggestion status:", error)
          toast.error("Failed to update suggestion status.")
        }
      }

      return (
        <div className="flex items-center space-x-1">
          <ComboboxPopover currentStatus={selectedStatus || null} onStatusChange={handleStatusChange} />
        </div>
      )
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      return <></>
    },
    cell: ({ row }) => {
      return <></>
    },
    filterFn: tagFilterFn,
  },
]
