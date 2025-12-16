import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { SignUp } from "./_components/SignUp";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";

import { Toaster } from "sonner";
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
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton>
                <button
                  className="bg-[#4169E1] text-white rounded-2xl font-semibold 
          text-xl h-12 px-6 cursor-pointer
          shadow-[0_4px_0_#27408B] transition-all
          hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
          active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
                >
                  Log in
                </button>
              </SignInButton>
              <SignUp />
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
//how to make if url "sign-up dont show the buttons"
