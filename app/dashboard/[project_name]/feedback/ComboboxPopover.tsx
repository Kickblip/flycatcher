"use client"

import * as React from "react"
import { statuses, Status } from "./utils"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxPopoverProps {
  currentStatus: Status | null
  onStatusChange: (status: Status) => void
}

export function ComboboxPopover({ currentStatus, onStatusChange }: ComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="w-[120px] justify-start">
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-1 h-4 w-4 shrink-0" strokeWidth={1.7} />
                {selectedStatus.label}
              </>
            ) : currentStatus ? (
              <>
                <currentStatus.icon className="mr-1 h-4 w-4" strokeWidth={1.7} />
                {currentStatus.label}
              </>
            ) : (
              <>Status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      const newSelectedStatus = statuses.find((status) => status.value === value) || null
                      setSelectedStatus(newSelectedStatus)
                      setOpen(false)
                      onStatusChange(newSelectedStatus!)
                    }}
                    className="cursor-pointer"
                  >
                    <status.icon
                      className={cn("mr-2 h-4 w-4", status.value === selectedStatus?.value ? "opacity-100" : "opacity-40")}
                      strokeWidth={1.7}
                    />
                    <span>{status.label}</span>
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
