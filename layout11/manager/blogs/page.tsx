import Link from "next/link";
import React from "react";

const Photo = () => {
  return (
    <div className="flex flex-col">
      <p>Blog</p>
      <Link href="/manager/blogs/create">Create Blog</Link>
      <Link href="/manager/blogs/123/edit">Detail Blog</Link>
    </div>
  );
};

export default Photo;
