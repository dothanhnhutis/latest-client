import { BlogRes } from "@/common.type";
import { http } from "@/lib/http";
import Link from "next/link";
import React from "react";
import DataTable from "./data-table";
import { columns } from "./columns";

const BlogPage = async () => {
  const { data } = await http.get<BlogRes[]>("/posts");

  return (
    <div className="flex flex-col gap-1">
      <DataTable data={data} columns={columns} />
      <Link href="/manager/blogs/create">create</Link>
      <Link href="/manager/blogs/123123/edit">edit</Link>
    </div>
  );
};

export default BlogPage;
