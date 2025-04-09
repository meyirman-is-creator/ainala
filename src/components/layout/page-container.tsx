"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PageContainerProps {
  children: React.ReactNode;
  showFooter?: boolean;
  footerVariant?: "default" | "minimal" | "dashboard";
  withScrollToTop?: boolean;
  className?: string;
  contentClassName?: string;
  fullWidth?: boolean;
  withBg?: boolean;
}

export default function PageContainer({
  children,
  showFooter = true,
  footerVariant = "default",
  withScrollToTop = false,
  className = "",
  contentClassName = "",
  fullWidth = false,
  withBg = false,
}: PageContainerProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!withScrollToTop) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [withScrollToTop]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        withBg && "bg-gray-50",
        className
      )}
    >
      <main className={cn("flex-1", contentClassName)}>
        {fullWidth ? (
          children
        ) : (
          <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
        )}
      </main>

      {showFooter && <Footer variant={footerVariant} />}

      {withScrollToTop && showScrollButton && (
        <button
          onClick={handleScrollToTop}
          className={cn(
            "fixed z-50 bg-ainala-blue text-white p-3 rounded-full shadow-lg transition-opacity",
            "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400",
            isMobile ? "bottom-4 right-4" : "bottom-8 right-8"
          )}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
