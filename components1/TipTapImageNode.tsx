import React from "react";
import Image from "next/image";
import { NodeViewWrapper } from "@tiptap/react";
import { AspectRatio } from "./ui/aspect-ratio";

const TipTapImageNode = (props: any) => {
  return (
    <NodeViewWrapper>
      <div className="max-w-[600px] mx-auto my-8">
        <AspectRatio
          ratio={3 / 2}
          className="flex items-center justify-center max-h-[400px]"
        >
          <Image
            priority
            fill
            src={props.node.attrs.src}
            alt={props.node.attrs.alt}
          />
        </AspectRatio>

        <p className="italic text-center text-sm p-2 bg-accent">
          {props.node.attrs.title}
        </p>
      </div>
    </NodeViewWrapper>
  );
};

export default TipTapImageNode;
