"use client";
import NavBar from "@/components/NavBar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { JetBrains_Mono } from 'next/font/google';
import { Orbitron } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '700']
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="min-w-[300px]">
        <div className="flex flex-col min-h-screen bg-gradient-to-bl from-black to-green-400">
          <SessionProvider>
            <NavBar />
            <div className="flex flex-grow px-4">{children}</div>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}