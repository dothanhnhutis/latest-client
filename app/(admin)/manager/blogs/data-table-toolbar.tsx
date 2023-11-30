"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { postSchema } from "./columns";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const post = postSchema
    .array()
    .parse(table.getRowModel().rows.map((row) => row.original));
  // console.log(post.map((data) => data.tag));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="w-[150px] lg:w-[250px] focus-visible:ring-transparent"
        />
        {table.getColumn("tag") && (
          <DataTableFacetedFilter
            column={table.getColumn("tag")}
            title="Tag"
            options={[
              {
                value: "lam-dep-1",
                label: "Làm đẹp 1",
              },
              {
                value: "lam-dep-10",
                label: "lam dep 10",
              },
            ]}
          />
        )}
        {/* {table.getColumn("author") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
