"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show the header on the main landing page
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-ainala-blue">
              Ainala
            </Link>
            <nav className="hidden md:flex ml-8">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/issue-details"
                    className={`text-gray-600 hover:text-ainala-blue ${
                      pathname === "/issue-details"
                        ? "font-medium text-ainala-blue"
                        : ""
                    }`}
                  >
                    Issues
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`text-gray-600 hover:text-ainala-blue ${
                      pathname === "/about"
                        ? "font-medium text-ainala-blue"
                        : ""
                    }`}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`text-gray-600 hover:text-ainala-blue ${
                      pathname === "/contact"
                        ? "font-medium text-ainala-blue"
                        : ""
                    }`}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-700">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">{children}</main>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                &copy; {new Date().getFullYear()} Ainala. All rights reserved.
              </p>
            </div>

            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-ainala-blue text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-ainala-blue text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-ainala-blue text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
