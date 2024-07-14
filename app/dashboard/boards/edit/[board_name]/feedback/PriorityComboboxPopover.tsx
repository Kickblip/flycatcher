"use client"

import * as React from "react"
import { priorities, Priority } from "./utils"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PriorityComboboxPopoverProps {
  currentPriority: Priority | null
  onPriorityChange: (priority: Priority) => void
}

export function PriorityComboboxPopover({ currentPriority, onPriorityChange }: PriorityComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPriority, setSelectedPriority] = React.useState<Priority | null>(null)

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="w-[100px] justify-start">
            {selectedPriority ? (
              <>
                <selectedPriority.icon className="mr-1 h-4 w-4 shrink-0" strokeWidth={1.7} />
                {selectedPriority.label}
              </>
            ) : currentPriority ? (
              <>
                <currentPriority.icon className="mr-1 h-4 w-4" strokeWidth={1.7} />
                {currentPriority.label}
              </>
            ) : (
              <>Priority</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {priorities.map((priority) => (
                  <CommandItem
                    key={priority.value}
                    value={priority.value.toString()}
                    onSelect={(value) => {
                      const newSelectedPriority = priorities.find((priority) => priority.value === Number(value)) || null
                      setSelectedPriority(newSelectedPriority)
                      setOpen(false)
                      onPriorityChange(newSelectedPriority!)
                    }}
                    className="cursor-pointer"
                  >
                    <priority.icon
                      className={cn("mr-2 h-4 w-4", priority.value === selectedPriority?.value ? "opacity-100" : "opacity-40")}
                      strokeWidth={1.7}
                    />
                    <span>{priority.label}</span>
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
