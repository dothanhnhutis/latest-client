import React from "react";
import { Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import AvatarDefault from "@/images/user-1.jpg";
// import { getServerAuthSession } from "@/lib/auth";
import LogoutBtn from "./LogoutBtn";

const UserMenu = async () => {
  // const session = await getServerAuthSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none ">
        <Avatar>
          <AvatarImage src={AvatarDefault.src} />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-10 w-10 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px]">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="w-24 h-24">
            <AvatarImage src={AvatarDefault.src} />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="w-24 h-24 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="w-full overflow-hidden">
            <p className="font-medium text-lg">Thanh Nhut</p>
            <p className="text-muted-foreground font-normal">Admin</p>
            <div className="flex items-center space-x-2 text-muted-foreground w-full">
              <Mail size={16} />
              <p className="text-sm truncate">gaconght@gmail.com</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />

        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
