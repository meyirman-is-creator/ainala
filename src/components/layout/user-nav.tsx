// src/components/layout/user-nav.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaSignOutAlt,
  FaUser,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";
import { logout } from "@/features/auth/authSlice";
import { useMediaQuery } from "@/hooks/use-media-query";

interface UserNavProps {
  onMenuOpen?: () => void;
}

export function UserNav({ onMenuOpen }: UserNavProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClick = () => {
    if (isMobile && onMenuOpen) {
      onMenuOpen();
    }
  };

  return (
    <>
      <Button
        className="relative h-8 w-8 rounded-full bg-transparent hover:bg-gray-100"
        onClick={handleClick}
      >
        <Avatar className="h-8 w-8 relative flex shrink-0 overflow-hidden rounded-full">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-blue-500 text-white flex h-full w-full items-center justify-center">
            {user?.name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Button>

      {/* Only show dropdown on larger screens */}
      {!isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative h-8 w-8 rounded-full bg-transparent hover:bg-gray-100">
              <Avatar className="h-8 w-8 relative flex shrink-0 overflow-hidden rounded-full">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-blue-500 text-white flex h-full w-full items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-50 min-w-[8rem] rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="h-px bg-gray-200 my-1" />
            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100">
                  <FaUser className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/account/issues">
                <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100">
                  <FaClipboardList className="mr-2 h-4 w-4" />
                  <span>Мои проблемы</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/account/add-issue">
                <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100">
                  <FaPlusCircle className="mr-2 h-4 w-4" />
                  <span>Добавить проблему</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="h-px bg-gray-200 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              <span>Выход</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
