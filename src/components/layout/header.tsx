// src/components/layout/header.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaSignInAlt, FaUserPlus, FaTimes } from "react-icons/fa";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1200px] px-[15px] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500">ainala</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`flex items-center text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive("/") && pathname !== "/issues"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <FaHome className="mr-2" />
              Главная
            </Link>
            <Link
              href="/issues"
              className={`flex items-center text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive("/issues") ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Проблемы
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <UserNav onMenuOpen={() => setIsOpen(true)} />
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button className="hidden sm:flex h-9 rounded-md px-3 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100">
                  <FaSignInAlt className="mr-2" />
                  Вход
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="hidden sm:flex h-9 rounded-md px-3 bg-blue-500 text-white hover:bg-blue-600">
                  <FaUserPlus className="mr-2" />
                  Регистрация
                </Button>
              </Link>
              <Link href="/auth/login" className="sm:hidden">
                <Button className="h-10 w-10 rounded-md border border-gray-200 bg-white hover:bg-gray-100">
                  <FaSignInAlt />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-64 md:hidden">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-blue-500">
                ainala
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/") &&
                  pathname !== "/issues" &&
                  !pathname.startsWith("/account")
                    ? "bg-blue-50 text-blue-500"
                    : ""
                }`}
              >
                <FaHome className="mr-2 h-4 w-4" />
                Главная
              </Link>
              <Link
                href="/issues"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/issues") ? "bg-blue-50 text-blue-500" : ""
                }`}
              >
                Проблемы
              </Link>
              <Link
                href="/account"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/account") ? "bg-blue-50 text-blue-500" : ""
                }`}
              >
                Личный кабинет
              </Link>
              <Link
                href="/account/profile"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/account/profile") ? "bg-blue-50 text-blue-500" : ""
                }`}
              >
                Профиль
              </Link>
              <Link
                href="/account/issues"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/account/issues") ? "bg-blue-50 text-blue-500" : ""
                }`}
              >
                Мои проблемы
              </Link>
              <Link
                href="/account/add-issue"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  isActive("/account/add-issue")
                    ? "bg-blue-50 text-blue-500"
                    : ""
                }`}
              >
                Добавить проблему
              </Link>
              <Button
                variant="ghost"
                className="justify-start px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                onClick={() => {
                  /* Add logout functionality */
                }}
              >
                Выход
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
};
