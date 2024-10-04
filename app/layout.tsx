import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AI } from "./ai";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Scout",
  description: "Search & Book movies tickets with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AI>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto h-full max-w-7xl`}
          >
            <Navbar />
            {children}
          </body>
        </AI>
      </ThemeProvider>
    </html>
  );
}
