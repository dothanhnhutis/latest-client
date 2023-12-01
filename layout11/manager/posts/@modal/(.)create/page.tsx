"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { PostForm } from "@/components/PostForm";
import { getServerAuthSession } from "@/lib/auth";
import Modal from "@/components/Modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreatePostModel = () => {
  const router = useRouter();

  return (
    <Modal>
      <Card className="relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 p-1"
        >
          <XIcon className="w-4 h-4" />
        </button>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
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
    </Modal>
  );
};

export default CreatePostModel;
