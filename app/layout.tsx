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
          <header className="flex justify-between items-center p-4 h-16 mt-6 mx-6">
            <div className="bg-[#4169E1] text-gray-100 px-6 py-3 rounded-lg text-4xl font-bold shadow-[0_4px_0_#27408B]">
              BRAINKET
            </div>

            <div className="flex gap-4 items-center">
              <SignedOut>
                <SignUpButton>
                  <button
                    className="bg-[#4169E1] text-white rounded-2xl font-semibold 
                    text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer
                    shadow-[0_4px_0_#27408B] transition-all
                    hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
                    active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          <div className="flex justify-center mt-8">
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
            </SignedOut>
          </div>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
