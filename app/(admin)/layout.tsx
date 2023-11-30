import Logo from "@/components/Logo";
import SideBar from "@/components/SideBar";
import { SwitchMode } from "@/components/SwitchMode";
import UserMenu from "@/components/UserMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import React from "react";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="backdrop-saturate-[1.8] sticky top-0 z-50 border-b backdrop-blur bg-background/60">
        <nav className="flex justify-between items-center p-2 pr-4 ">
          <Logo />
          <div className="flex items-center space-x-6 ml-6 text-sm font-medium">
            <Link
              prefetch={false}
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>

            <Link
              prefetch={false}
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Blog
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <SwitchMode />
            <UserMenu />
          </div>
        </nav>
      </header>
      <main className="relative flex ">
        <div className="sticky top-[73px] h-[calc(100vh-73px)]">
          <ScrollArea className="hidden lg:flex flex-shrink-0 w-[200px] h-full">
            <SideBar />
          </ScrollArea>
        </div>
        {children}
      </main>
    </>
  );
};

export default ManagerLayout;
