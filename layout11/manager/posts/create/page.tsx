import { PostForm } from "@/components/PostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import React from "react";

const PostCreatePage = async () => {
  const session = await getServerAuthSession();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create post</CardTitle>
        <CardDescription>Create new post now</CardDescription>
      </CardHeader>
      <CardContent>
        <PostForm session={session} />
      </CardContent>
    </Card>
  );
};

export default PostCreatePage;
