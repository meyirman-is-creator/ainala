"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaUser, FaClipboardList, FaPlusCircle, FaHome } from "react-icons/fa";

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
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-gray-900">
            Личный кабинет
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  className={cn(
                    "w-full justify-start h-9 rounded-md px-3",
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
        </div>
      </div>
    </div>
  );
}
