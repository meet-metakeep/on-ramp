"use client";

/**
 * @title Smart Header Component
 * @notice Responsive header with wallet integration and smart scroll behavior
 * @dev Auto-hides on scroll down, shows on scroll up for better UX
 * @author Meet - Coinbase Onramp Integration Demo
 */

import { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image"; // Commented out - logo removed
import { usePathname } from "next/navigation";
// import { WalletDefault } from "@coinbase/onchainkit/wallet"; // Commented out - wallet removed

/**
 * @notice Main Header component with smart scroll behavior
 * @dev Tracks scroll position and automatically hides/shows header for better UX
 * @return JSX.Element Responsive header with navigation and wallet integration
 */
export function Header() {
  const pathname = usePathname();

  // State for scroll behavior and UI
  const [isScrolled, setIsScrolled] = useState(false); // Header background blur state
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle - COMMENTED OUT
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Previous scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Header visibility logic
      if (currentScrollY < 10) {
        // At top of page, always show header
        setIsHeaderVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down & past 100px
          setIsHeaderVisible(false);
          // setIsMobileMenuOpen(false); // Close mobile menu when hiding - COMMENTED OUT
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsHeaderVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* COMMENTED OUT FOR EXPERIMENT - Logo removed */}
          {/*
          <Link href="/" className="flex items-center">
            <div className="h-10 mr-3">
              <Image
                src="/coinbase-logo.png"
                alt="Coinbase Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Coinbase Onramp
            </span>
          </Link>
          */}
          <div></div> {/* Empty div to maintain layout */}
          {/* Desktop Navigation - WALLET COMMENTED OUT FOR EXPERIMENT */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink
              href="/"
              isActive={pathname === "/"}
              isScrolled={isScrolled}
            >
              Onramp
            </NavLink>

            {/* COMMENTED OUT WALLET CONNECT BUTTON */}
            {/*
            <div className="ml-4">
              <WalletDefault />
            </div>
            */}
          </nav>
          {/* Mobile Menu Button - COMMENTED OUT FOR EXPERIMENT */}
          {/*
          <button
            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          */}
        </div>
      </div>

      {/* Mobile Navigation - COMMENTED OUT FOR EXPERIMENT */}
      {/*
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mt-2 py-4 px-4 absolute left-4 right-4">
          <nav className="flex flex-col space-y-3">
            <MobileNavLink
              href="/"
              isActive={pathname === "/"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Onramp
            </MobileNavLink>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <WalletDefault />
            </div>
          </nav>
        </div>
      )}
      */}
    </header>
  );
}

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  isScrolled: boolean;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";

  const activeClasses =
    "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm";

  const inactiveClasses =
    "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 hover:text-blue-600 dark:hover:text-blue-300";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </Link>
  );
}

// COMMENTED OUT - Mobile navigation removed
/*
function MobileNavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-medium ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
*/

// For backward compatibility
export default Header;
