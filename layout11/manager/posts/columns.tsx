"use client";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarDefault from "@/images/user-1.jpg";
import { Skeleton } from "@/components/ui/skeleton";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  tag: z.object({
    slug: z.string(),
    tagName: z.string(),
  }),
  author: z.object({
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

export type Post = z.infer<typeof postSchema>;

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) => {
      const tag = row.getValue("tag") as Post["tag"];
      return <div className="capitalize">{tag.tagName}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as Post["author"];
      return (
        <div className="flex items-center gap-2 capitalize">
          <Avatar>
            <AvatarImage src={author.avatarUrl ?? AvatarDefault.src} />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="h-10 w-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          {author.username}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
