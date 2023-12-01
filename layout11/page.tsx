import Logo from "@/components/Logo";
import SideBar from "@/components/SideBar";
import { SwitchMode } from "@/components/SwitchMode";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";
import React from "react";

export default async function Home() {
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

      <main className="relative flex">
        <div className="sticky top-[73px] h-[calc(100vh-73px)] flex flex-shrink-0 border-r">
          <SideBar />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="bg-green-200 h-[3000px]">asdas</div>
        </div>
      </main>
      {/* <footer className="bg-blue-500 h-[300px]">dsdads</footer> */}
    </>
  );
}
