import React from "react";
import Image from "next/image";
import MediaChatImage from "@/images/mediachat.png";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const PostLayout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <div className="flex-auto xl:max-w-7xl xl:mx-auto px-6 pb-4 pt-3">
      <div className="flex flex-col flex-grow">
        <div className="relative flex-col flex flex-shrink-0 bg-[#ecf2ff] dark:bg-primary-foreground rounded-xl overflow-hidden px-[25px] pt-[30px] pb-5 mb-6">
          <h4 className="font-semibold text-2xl">Blog app</h4>
          <h6 className="font-normal text-lg">
            <ul className="flex items-center text-sm gap-1">
              <li>
                <Link href="/manager" prefetch className="py-2">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <Link href="/manager/blogs" prefetch className="py-2">
                Blogs
              </Link>
              <li>
                <ChevronRightIcon className="w-4 h-4" />
              </li>
              <li>
                <p className="py-2">Create</p>
              </li>
            </ul>
          </h6>
          <div className="absolute right-[20px] top-0 w-[165px] h-[165px]">
            <Image priority src={MediaChatImage} alt="mediachat" />
          </div>
        </div>
        {children}
        {modal}
      </div>
    </div>
  );
};

export default PostLayout;
