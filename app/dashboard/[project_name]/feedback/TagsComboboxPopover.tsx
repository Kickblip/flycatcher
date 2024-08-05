"use client"

import * as React from "react"

import { Tag } from "@/types/SuggestionBoard"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlusIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline"
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

interface TagComboboxPopoverProps {
  possibleTags: Tag[]
  currentTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  onTagCreate: (tagName: string) => void
  onTagDelete: (tag: Tag) => void
}

export function TagComboboxPopover({
  possibleTags,
  currentTags,
  onTagsChange,
  onTagCreate,
  onTagDelete,
}: TagComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>(currentTags)
  const [newTagName, setNewTagName] = React.useState("")

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((selectedTag) => selectedTag.label === tag.label)
    let newSelectedTags: Tag[]

    if (isSelected) {
      newSelectedTags = selectedTags.filter((selectedTag) => selectedTag.label !== tag.label)
    } else {
      newSelectedTags = [...selectedTags, tag]
    }

    setSelectedTags(newSelectedTags)
    onTagsChange(newSelectedTags)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-wrap space-x-2" onClick={() => setOpen(true)}>
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap items-center">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="text-xs px-2 py-1 rounded-lg border mr-2 my-0.5"
                    style={{
                      color: tag.primaryColor,
                      backgroundColor: tag.secondaryColor,
                      borderColor: tag.primaryColor,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
                <PlusIcon className="h-3.5 w-3.5 text-gray-700 text-xs" strokeWidth={1.7} />
              </div>
            ) : (
              <PlusIcon className="h-3.5 w-3.5 text-gray-700 text-xs my-2 mx-1" strokeWidth={1.7} />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {possibleTags.map((tag) => (
                  <CommandItem
                    key={tag.label}
                    value={tag.label}
                    onSelect={() => toggleTag(tag)}
                    className="cursor-pointer flex items-center space-x-2 justify-between w-full"
                  >
                    <div
                      key={tag.label}
                      className="text-xs px-2 py-1 rounded-lg border mr-2 my-0.5"
                      style={{
                        color: tag.primaryColor,
                        backgroundColor: tag.secondaryColor,
                        borderColor: tag.primaryColor,
                        opacity: selectedTags.some((selectedTag) => selectedTag.label === tag.label) ? 1 : 0.7,
                      }}
                    >
                      {tag.label}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()}>
                          <TrashIcon className="h-4 w-4 text-gray-500" strokeWidth={1.7} />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This tag will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              onTagDelete(tag)
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem className="flex items-center justify-between w-full">
                  <input
                    type="text"
                    placeholder="New tag"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      onTagCreate(newTagName)
                    }}
                    className="hover:bg-gray-100 transition duration-200 rounded-lg p-1.5"
                  >
                    <PlusIcon className="h-4 w-4 text-gray-500" strokeWidth={1.7} />
                  </button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
