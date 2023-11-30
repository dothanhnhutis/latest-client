import { Row } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { postSchema } from "./columns";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const post = postSchema.parse(row.original);
  return (
    <div className="flex items-center gap-2">
      <Link href={`/manager/posts/${post.id}/edit`}>
        <EditIcon className="w-4 h-4" />
      </Link>
      <button className="p-3">
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
