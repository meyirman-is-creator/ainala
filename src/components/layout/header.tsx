"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1200px] px-[15px] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="block md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaBars className="h-5 w-5" />
                  <span className="sr-only">Меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-blue-500">
                    ГородОК
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    <FaHome className="mr-2 h-4 w-4" />
                    Главная
                  </Link>
                  <Link
                    href="/issues"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    Проблемы
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/account/profile"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        Профиль
                      </Link>
                      <Link
                        href="/account/issues"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        Мои проблемы
                      </Link>
                      <Link
                        href="/account/add-issue"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        Добавить проблему
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        Выход
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        <FaSignInAlt className="mr-2 h-4 w-4" />
                        Вход
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        <FaUserPlus className="mr-2 h-4 w-4" />
                        Регистрация
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500">ainala</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-blue-500"
            >
              <FaHome className="mr-2" />
              Главная
            </Link>
            <Link
              href="/issues"
              className="flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-blue-500"
            >
              Проблемы
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserNav />
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
    </header>
  );
};
