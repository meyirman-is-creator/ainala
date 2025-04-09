"use client";

import { useAppSelector } from "@/store";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarExpanded = useAppSelector(
    (state) => state.ui.isSidebarExpanded
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "ml-56" : "ml-16 md:ml-56"
        }`}
      >
        <Navbar />

        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
