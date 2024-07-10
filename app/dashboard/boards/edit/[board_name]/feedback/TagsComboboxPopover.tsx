"use client"

import * as React from "react"

import { Tag } from "@/types/SuggestionBoard"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlusIcon } from "@heroicons/react/24/outline"

interface TagComboboxPopoverProps {
  possibleTags: Tag[]
  currentTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

export function TagComboboxPopover({ possibleTags, currentTags, onTagsChange }: TagComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>(currentTags)

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
              selectedTags.map((tag) => (
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
              ))
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
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <span
                      className="w-4 h-4 inline-block rounded-full"
                      style={{
                        backgroundColor: tag.primaryColor,
                      }}
                    />
                    <span
                      style={{
                        color: selectedTags.some((selectedTag) => selectedTag.label === tag.label) ? tag.primaryColor : "inherit",
                      }}
                    >
                      {tag.label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
