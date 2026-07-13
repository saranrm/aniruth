import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

export const metadata: Metadata = {
  title: "Aniruth",
  description: "A focused AI editor workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isClerkConfigured ? (
          <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
        ) : (
          <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-6 py-16 text-foreground">
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Authentication setup required
              </p>
              <h1 className="mt-3 text-2xl font-semibold">
                Clerk is not configured yet
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Add the Clerk environment values below to enable sign-in and
                sign-up experiences.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
                {`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...`}
              </pre>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
