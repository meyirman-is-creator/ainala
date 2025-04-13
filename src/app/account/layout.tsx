// src/app/account/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";
import { Sidebar } from "@/components/layout/sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-6 min-h-screen">
      <div className="container max-w-[1200px] px-[15px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <Sidebar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
