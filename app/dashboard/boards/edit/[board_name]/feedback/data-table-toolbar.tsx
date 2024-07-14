"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { priorities, statuses } from "./utils"
import { Tag } from "@/types/SuggestionBoard"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableFacetedTagFilter } from "./data-table-tag-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  possibleTags: Tag[]
}

export function DataTableToolbar<TData>({ table, possibleTags }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search feedback..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter column={table.getColumn("priority")} title="Priority" options={priorities} />
        )}
        <DataTableFacetedTagFilter table={table} title="Tags" possibleTags={possibleTags} />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
