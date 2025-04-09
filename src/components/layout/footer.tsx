"use client";

import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";

interface FooterProps {
  variant?: "default" | "minimal" | "dashboard";
  className?: string;
}

export default function Footer({
  variant = "default",
  className = "",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Minimal footer for dashboard and admin pages
  if (variant === "minimal") {
    return (
      <footer className={`py-4 text-center text-sm text-gray-500 ${className}`}>
        <p>&copy; {currentYear} Ainala. All rights reserved.</p>
      </footer>
    );
  }

  // Dashboard footer with condensed links
  if (variant === "dashboard") {
    return (
      <footer className={`bg-white py-4 border-t border-gray-200 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Ainala. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-ainala-blue"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-ainala-blue"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-500 hover:text-ainala-blue"
              >
                Contact
              </Link>
              <Link
                href="/help"
                className="text-sm text-gray-500 hover:text-ainala-blue"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default full footer
  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ainala</h3>
            <p className="text-gray-400">
              A platform for civic engagement and urban issue resolution. Report
              and track issues in your city to create a better community.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/issue-details" className="hover:text-white">
                  Browse Issues
                </Link>
              </li>
              <li>
                <Link href="/add-issues" className="hover:text-white">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/my-issues" className="hover:text-white">
                  My Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Ainala. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-500 text-sm">
            Made with <FaHeart className="inline text-red-500 mx-1" /> in
            Shymkent
          </div>
        </div>
      </div>
    </footer>
  );
}
