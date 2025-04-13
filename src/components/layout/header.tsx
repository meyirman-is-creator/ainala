"use client";
import Link from "next/link";
import { FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";

export const Header = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500">ГородОК</span>
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
