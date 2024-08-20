"use client"

import { FaTrash } from "react-icons/fa6"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DeleteButton({ target, onConfirm }: { target: string; onConfirm: () => void }) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <TooltipProvider>
        <Tooltip>
          <AlertDialog>
            <AlertDialogTrigger>
              <TooltipTrigger>
                <button className="text-redorange-500 hover:bg-redorange-500 hover:text-white transition duration-200 p-2 rounded">
                  <FaTrash className="w-4 h-4" />
                </button>
              </TooltipTrigger>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>{`This action cannot be undone. This will permanently delete your ${target}.`}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TooltipContent>
            <p>{`Delete ${target}`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
