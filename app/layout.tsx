import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brainket",
  description: "Fun, free, educational games for everyone!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-between items-center p-4 h-16 mt-6 mx-4 sm:mx-8 md:mx-16 lg:mx-20">
            <div
              className="bg-[#8598FF] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-wider
                shadow-[0_6px_0_#27408B] hover:scale-105 transition-transform
                text-center drop-shadow-lg"
            >
              BRAINKET
            </div>

            <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
