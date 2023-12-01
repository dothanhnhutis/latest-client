import { http } from "@/lib/http";

import React from "react";
import PostDetailTipTap from "./detail-post";
export type BlogDetailRes = {
  title: string;
  thumnail: string;
  slug: string;
  content: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
  tag: {
    slug: string;
    tagName: string;
  };
};

const BlogDetail = async ({ params }: { params: { slug: string } }) => {
  const { data: post } = await http.get<BlogDetailRes>(`/posts/${params.slug}`);

  return (
    <div>
      <PostDetailTipTap post={post} />
    </div>
  );
};

export default BlogDetail;
