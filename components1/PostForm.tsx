"use client";
import { ImagePlusIcon, LockIcon, UnlockIcon, XIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { CurrentUser, ImageRes, TagRes, UserRes } from "@/common.type";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import AvatarDefault from "@/images/user-1.jpg";
import React from "react";
import { generateSlug, isBase64DataURL } from "@/lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import {
  ReactNodeViewRenderer,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import Tiptap from "./Tiptap";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import List from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import LinkTipTap from "@tiptap/extension-link";
import ImageTipTap from "@tiptap/extension-image";
import TextStyleTiptap from "@tiptap/extension-text-style";
import ColorTiptap from "@tiptap/extension-color";
import TipTapImageNode from "./TipTapImageNode";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export type PostSubmit = {
  title: string;
  thumnail: string | null;
  slug: string;
  content: string;
  tagId: string;
  authorId: string;
};

type Levels = 1 | 2 | 3 | 4;

const classes: Record<Levels, string> = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
  4: "text-1xl",
};

export const PostForm = ({ session }: { session: CurrentUser }) => {
  const router = useRouter();
  // const { data, status } = useSession();
  // console.log(data?.user);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.extend({
        renderHTML({ node, HTMLAttributes }) {
          const hasLevel = this.options.levels.includes(node.attrs.level);
          const level: Levels = hasLevel
            ? node.attrs.level
            : this.options.levels[0];

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }),
      List,
      BulletList.extend({
        renderHTML({ node, HTMLAttributes }) {
          return [
            "ul",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: "list-disc pl-10 my-2",
            }),
            0,
          ];
        },
      }),
      OrderedList.extend({
        renderHTML({ node, HTMLAttributes }) {
          return [
            "ol",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: "list-decimal pl-10 my-2",
            }),
            0,
          ];
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      LinkTipTap.configure({
        protocols: ["ftp", "mailto"],
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      ImageTipTap.configure({
        allowBase64: true,
        inline: true,
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(TipTapImageNode);
        },
      }),
      TextStyleTiptap,
      ColorTiptap.configure({
        types: ["textStyle"],
      }),
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
          },
        },
      ],
    },
    autofocus: false,
    editable: true,
    injectCSS: true,
  });

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await http.get<UserRes[]>("/users");
      return data;
    },
  });

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await http.get<TagRes[]>("/tags");
      return data;
    },
  });

  const [isLockSlug, setIsLockSlug] = React.useState<boolean>(true);

  const [formSubmitData, setFormSubmitData] = React.useState<PostSubmit>({
    title: "",
    thumnail: null,
    slug: "",
    content: "",
    tagId: "",
    authorId: session.id,
  });

  React.useEffect(() => {
    setFormSubmitData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
  }, [formSubmitData.title]);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      toast({
        description: "Please upload an image!",
      });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setFormSubmitData((prev) => ({ ...prev, thumnail: result }));
    };
  };

  const postMutation = useMutation({
    mutationFn: async () => {
      if (
        formSubmitData.thumnail &&
        formSubmitData.thumnail.length > 0 &&
        isBase64DataURL(formSubmitData.thumnail)
      ) {
        const { data } = await http.post<ImageRes>(`/images`, {
          data: formSubmitData.thumnail,
          tags: ["thumnail"],
        });
        const { data: postRes } = await http.post("/posts", {
          ...formSubmitData,
          thumnail: data.url,
        });
        return postRes;
      } else {
        const { data } = await http.post("/posts", formSubmitData);
        return data;
      }
    },
    onSuccess() {
      editor?.commands.clearContent();
      setFormSubmitData((prev) => ({
        ...prev,
        slug: "",
        tagId: "",
        authorId: session.id,
        thumnail: null,
        title: "",
        content: JSON.stringify(editor?.getJSON()!),
      }));
    },
  });

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormSubmitData({
      ...formSubmitData,
      content: JSON.stringify(editor?.getJSON()!),
    });

    postMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <div className="grid lg:grid-cols-2 w-full gap-4 ">
        {formSubmitData.thumnail ? (
          <AspectRatio ratio={16 / 9} className="bg-muted relative ">
            <Image
              src={formSubmitData.thumnail}
              alt="thumnail"
              fill
              className="rounded-md object-cover"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setFormSubmitData((prev) => ({ ...prev, thumnail: null }));
              }}
              variant="ghost"
              className="absolute top-0 right-0 p-1 h-auto bg-transparent"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </AspectRatio>
        ) : (
          <Label
            htmlFor="thumnail"
            className="h-[200px] lg:h-auto text-muted-foreground border-2 border-dashed w-full rounded-lg flex items-center justify-center cursor-pointer"
          >
            <div>
              <ImagePlusIcon className="w-14 h-14" />
              <p>Thumnail</p>
            </div>
            <input
              onChange={handleChangeImage}
              type="file"
              name="thumnail"
              id="thumnail"
              className="hidden"
            />
          </Label>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formSubmitData.title}
              onChange={(e) =>
                setFormSubmitData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="focus-visible:ring-transparent "
              placeholder="Name of your project"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input
                disabled={isLockSlug}
                id="slug"
                name="slug"
                value={formSubmitData.slug}
                onChange={(e) =>
                  setFormSubmitData((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
                className="focus-visible:ring-transparent "
                placeholder="Name of your project"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsLockSlug(!isLockSlug)}
              >
                {!isLockSlug ? (
                  <UnlockIcon className="w-4 h-4" />
                ) : (
                  <LockIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tag">Tag</Label>

            <Select
              onValueChange={(v) =>
                setFormSubmitData((prev) => ({ ...prev, tagId: v }))
              }
              value={formSubmitData.tagId}
            >
              <SelectTrigger className="focus-visible:ring-transparent">
                {tagQuery.isLoading ? (
                  <Skeleton className="h-4 w-4/5" />
                ) : (
                  <SelectValue placeholder="Select tag" />
                )}
              </SelectTrigger>
              <SelectContent id="tag" className="max-h-[170px]">
                {tagQuery.data?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.tagName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Author</Label>

            <Select
              onValueChange={(v) =>
                setFormSubmitData((prev) => ({ ...prev, authorId: v }))
              }
              defaultValue={session.id}
            >
              <SelectTrigger className="focus-visible:ring-transparent text-start h-auto">
                {userQuery.isLoading ? (
                  <div className="flex space-x-4 w-full">
                    <Skeleton className="flex flex-shrink-0 h-10 w-10 rounded-full" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  </div>
                ) : (
                  <SelectValue placeholder="Select author" />
                )}
              </SelectTrigger>
              <SelectContent>
                <div className="max-h-[220px]">
                  {userQuery.data?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <div className="flex items-center gap-2 ">
                        <Avatar>
                          <AvatarImage
                            src={u.avatarUrl ?? AvatarDefault.src}
                            alt="avatar"
                            className="z-[1]"
                          />
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                        <div className="w-full overflow-hidden">
                          <p className="truncate">Thanh Nhut</p>
                          <p className="text-sm text-muted-foreground truncate">
                            dothanhnhis@gmail.com
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5 mt-4">
        <Label htmlFor="content">Content</Label>
        <Tiptap editor={editor} />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={() => router.back()} type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};
