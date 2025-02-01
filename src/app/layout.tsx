"use client";
import NavBar from "@/components/NavBar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-w-[300px]">
        <div className="flex flex-col min-h-screen bg-gradient-to-bl from-black to-green-400">
          <NavBar />
          <SessionProvider>
            <div className="flex flex-grow px-4">{children}</div>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
