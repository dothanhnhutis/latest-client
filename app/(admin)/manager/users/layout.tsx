import React from "react";
import Image from "next/image";
import MediaChatImage from "@/images/mediachat.png";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-auto flex flex-row xl:max-w-7xl xl:mx-auto px-6 pb-4 pt-3 h-[calc(100vh-73px)]">
      <div className="flex flex-col flex-grow h-full">
        <div className="relative flex-col flex flex-shrink-0 bg-[#ecf2ff] dark:bg-primary-foreground rounded-xl overflow-hidden px-[25px] pt-[30px] pb-5 mb-6">
          <h4 className="font-semibold text-2xl">User</h4>
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
              <li>
                <p className="py-2">Users</p>
              </li>
            </ul>
          </h6>
          <div className="absolute right-[20px] top-0 w-[165px] h-[165px] ">
            <Image priority src={MediaChatImage} alt="mediachat" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default UsersLayout;
