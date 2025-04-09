"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaHome,
  FaPlus,
  FaList,
  FaUser,
  FaMapMarkerAlt,
  FaChartBar,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar } from "@/store/slices/ui-slice";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isSidebarExpanded = useAppSelector(
    (state) => state.ui.isSidebarExpanded
  );
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const isAdmin = session?.user?.role === "admin";

  const menuItems = [
    {
      icon: <FaHome className="text-ainala-blue" size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      showFor: "all",
    },
    {
      icon: <FaPlus className="text-ainala-blue" size={20} />,
      label: "Add Issue",
      href: "/add-issues",
      showFor: "auth",
    },
    {
      icon: <FaList className="text-ainala-blue" size={20} />,
      label: "My Issues",
      href: "/my-issues",
      showFor: "auth",
    },
    {
      icon: <FaMapMarkerAlt className="text-ainala-blue" size={20} />,
      label: "Issue Details",
      href: "/issue-details",
      showFor: "all",
    },
    {
      icon: <FaUser className="text-ainala-blue" size={20} />,
      label: "Profile",
      href: "/profile",
      showFor: "auth",
    },
    {
      icon: <FaChartBar className="text-ainala-blue" size={20} />,
      label: "Admin Panel",
      href: "/admin/all-issues",
      showFor: "admin",
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.showFor === "all") return true;
    if (item.showFor === "auth" && session) return true;
    if (item.showFor === "admin" && isAdmin) return true;
    return false;
  });

  return (
    <aside
      className={cn(
        "sidebar fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30",
        isSidebarExpanded || !isMobile ? "w-56" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-200">
        {isSidebarExpanded || !isMobile ? (
          <h1 className="text-xl font-bold text-ainala-blue">Ainala</h1>
        ) : (
          <h1 className="text-xl font-bold text-ainala-blue">A</h1>
        )}
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-ainala-blue transition-colors",
                  pathname === item.href &&
                    "bg-blue-50 text-ainala-blue font-medium"
                )}
              >
                <span className="flex items-center justify-center w-6">
                  {item.icon}
                </span>
                {(isSidebarExpanded || !isMobile) && (
                  <span className="ml-4">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isMobile && (
        <button
          className="absolute bottom-6 left-0 right-0 mx-auto w-8 h-8 flex items-center justify-center text-gray-500 hover:text-ainala-blue"
          onClick={() => dispatch(toggleSidebar())}
        >
          {isSidebarExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      )}
    </aside>
  );
}
