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

const CreateBlogPage = async () => {
  // const session = await getServerAuthSession();
  // console.log(session);
  return (
    <p>asdasd</p>
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Create post</CardTitle>
    //     <CardDescription>Create new post now</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     {/* <PostForm session={session} /> */}
    //     <p>asdas</p>
    //   </CardContent>
    // </Card>
  );
};

export default CreateBlogPage;
