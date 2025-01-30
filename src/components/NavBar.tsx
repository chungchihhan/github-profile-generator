"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4">
      <div className="mx-auto p-4 rounded-lg sm:px-6 lg:px-8 bg-white/10 backdrop-blur-lg shadow-2xl">
        <div className="flex justify-between items-center text-white">
          {/* Logo / Brand */}
          <Link href="/" className="text-2xl font-bold text-white">
            GitVatar
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/generate">Generate</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none text-white py-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden space-y-2 py-4 text-white">
            <NavLink href="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink href="/about" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <NavLink href="/generate" onClick={() => setIsOpen(false)}>
              Generate
            </NavLink>
            <NavLink href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

// Reusable NavLink Component
const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    className="block px-4 py-2 text-white hover:text-gray-300 transition"
    onClick={onClick}
  >
    {children}
  </Link>
);
