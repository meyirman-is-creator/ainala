// src/components/layout/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaUser, FaClipboardList, FaPlusCircle, FaHome } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sidebarItems = [
  {
    title: "Главная",
    href: "/account",
    icon: <FaHome className="mr-2 h-4 w-4" />,
  },
  {
    title: "Профиль",
    href: "/account/profile",
    icon: <FaUser className="mr-2 h-4 w-4" />,
  },
  {
    title: "Мои проблемы",
    href: "/account/issues",
    icon: <FaClipboardList className="mr-2 h-4 w-4" />,
  },
  {
    title: "Добавить проблему",
    href: "/account/add-issue",
    icon: <FaPlusCircle className="mr-2 h-4 w-4" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Card className="border-gray-200 rounded-lg bg-white shadow-sm sticky top-20">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-lg font-semibold tracking-tight text-gray-900">
          Личный кабинет
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                className={cn(
                  "w-full justify-start h-9 rounded-md px-3 mb-1",
                  pathname === item.href
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-transparent text-gray-900 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
