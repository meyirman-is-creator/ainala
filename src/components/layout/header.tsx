"use client"
import Link from "next/link";
import { FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";

export const Header = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">ГородОК</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <FaHome className="mr-2" />
              Главная
            </Link>
            <Link
              href="/issues"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <FaSignInAlt className="mr-2" />
                  Вход
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="hidden sm:flex">
                  <FaUserPlus className="mr-2" />
                  Регистрация
                </Button>
              </Link>
              <Link href="/auth/login" className="sm:hidden">
                <Button variant="outline" size="icon">
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
