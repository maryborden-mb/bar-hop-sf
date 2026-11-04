import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Fraunces, Inter } from "next/font/google";
import { getUser } from "@/lib/auth";
import { logOut } from "@/app/auth/actions";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bar Hop SF",
  description: "A personal journal for San Francisco bars.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="site-header">
          <Link href="/" className="brand">
            Bar Hop SF
          </Link>
          <nav className="nav">
            <Suspense>
              <AccountLinks />
            </Suspense>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

// Reads the session, so it streams in behind the Suspense boundary above.
async function AccountLinks() {
  const user = await getUser();
  if (!user) {
    return (
      <>
        <Link href="/login">Log in</Link>
        <Link href="/signup" className="button small">
          Sign up
        </Link>
      </>
    );
  }
  return (
    <>
      <Link href="/journal">Journal</Link>
      <Link href="/favorites">Favorites</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/bars/new">Add bar</Link>
      <form action={logOut}>
        <button type="submit" className="link-button">
          Log out
        </button>
      </form>
    </>
  );
}
