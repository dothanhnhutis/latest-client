import { PostForm } from "@/components/PostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const EditPost = ({ params }: { params: { id: string } }) => {
  console.log(1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit post</CardTitle>
        <CardDescription>Create new post now</CardDescription>
      </CardHeader>
      <CardContent>
        <PostForm
          session={{
            id: "",
            avatarUrl: "",
            email: "",
            name: "",
            role: "Admin",
            username: "",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default EditPost;
