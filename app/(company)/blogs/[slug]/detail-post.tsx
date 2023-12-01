"use client";
import React from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import TipTapList from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import LinkTipTap from "@tiptap/extension-link";
import ImageTipTap from "@tiptap/extension-image";
import TextStyleTiptap from "@tiptap/extension-text-style";
import ColorTiptap from "@tiptap/extension-color";
import {
  EditorContent,
  ReactNodeViewRenderer,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import TipTapImageNode from "@/components/TipTapImageNode";
import { BlogDetailRes } from "./page";

type Levels = 1 | 2 | 3 | 4;

const classes: Record<Levels, string> = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
  4: "text-1xl",
};
const PostDetailTipTap = ({ post }: { post: BlogDetailRes }) => {
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
      TipTapList,
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
    content: post ? JSON.parse(post.content) : undefined,
    autofocus: false,
    editable: false,
    injectCSS: true,
  });
  return (
    <EditorContent contentEditable={false} spellCheck={false} editor={editor} />
  );
};

export default PostDetailTipTap;
