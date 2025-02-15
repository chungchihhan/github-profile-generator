"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="p-4">
      <div className="mx-auto p-4 rounded-lg px-8 bg-white/10 backdrop-blur-lg shadow-2xl">
        <div className="flex justify-between items-center text-white font-mono">
          {/* Logo / Brand */}
          <Link href="/" className="text-2xl font-bold text-white">
            GitVatar
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 h-10">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/repos">Repos</NavLink>
            <NavLink href="/generate">Generate</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Link href="/login" className="flex items-center">
              <div className="flex overflow-hidden rounded-full border-2 border-white">
                {session ? (
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <User className="text-white" size={26} />
                )}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex gap-6">
            <button
              className="focus:outline-none text-white py-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/login" className="flex items-center">
              <div className="flex overflow-hidden rounded-full border-2 border-white">
                {session ? (
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <User className="text-white" size={26} />
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden space-y-2 py-2 text-white">
            <NavLink href="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink href="/about" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <NavLink href="/repos" onClick={() => setIsOpen(false)}>
              Repos
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
    className="block p-2 text-white hover:text-gray-300 hover:underline transition"
    onClick={onClick}
  >
    {children}
  </Link>
);
