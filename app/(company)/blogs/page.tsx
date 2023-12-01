"use client";
import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

type BlogsRes = {
  title: string;
  thumnail: string;
  slug: string;
  tag: {
    slug: string;
    tagName: string;
  };
};

const BlogsPage = () => {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await http.get<BlogsRes[]>("/posts");
      return data;
    },
  });
  return (
    <div className="flex flex-col">
      {posts?.map((post) => (
        <Link href={`/blogs/${post.slug}`} key={post.slug}>
          {post.title}
        </Link>
      ))}
    </div>
  );
};

export default BlogsPage;
