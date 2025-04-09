"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { setSearchQuery } from "@/store/slices/issues-slice";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));

    // If not on the issue-details page, navigate there
    if (!window.location.pathname.includes("/issue-details")) {
      router.push("/issue-details");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center flex-1">
        <form onSubmit={handleSearch} className="max-w-xl w-full">
          <div className="relative">
            <Input
              type="search"
              placeholder="Report urban issues, add photos and tags"
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <button className="relative text-gray-600 hover:text-ainala-blue">
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">
                3
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="bg-ainala-blue text-white w-8 h-8 rounded-full flex items-center justify-center">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden md:block font-medium">
                    {session.user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-issues" className="w-full cursor-pointer">
                    My Issues
                  </Link>
                </DropdownMenuItem>
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/all-issues"
                      className="w-full cursor-pointer"
                    >
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-ainala-blue">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-ainala-blue hover:bg-blue-700">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
