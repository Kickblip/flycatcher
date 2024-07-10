import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Tag } from "@/types/SuggestionBoard"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DataTableFacetedTagFilterProps<TData> {
  table: Table<TData>
  title?: string
  possibleTags: Tag[]
}

export function DataTableFacetedTagFilter<TData>({ table, title, possibleTags }: DataTableFacetedTagFilterProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const filterValue = table.getState().columnFilters.find((filter) => filter.id === "tags")?.value
  const selectedValues = new Set(Array.isArray(filterValue) ? filterValue : [])

  const toggleTag = (tag: Tag) => {
    if (selectedValues.has(tag.label)) {
      selectedValues.delete(tag.label)
    } else {
      selectedValues.add(tag.label)
    }
    const filterValues = Array.from(selectedValues)
    table.getColumn("tags")?.setFilterValue(filterValues.length ? filterValues : undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  possibleTags
                    .filter((tag) => selectedValues.has(tag.label))
                    .map((tag) => (
                      <Badge variant="secondary" key={tag.label} className="rounded-sm px-1 font-normal">
                        {tag.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {possibleTags.map((tag) => {
                const isSelected = selectedValues.has(tag.label)
                return (
                  <CommandItem
                    key={tag.label}
                    onSelect={() => toggleTag(tag)}
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{tag.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => table.getColumn("tags")?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
