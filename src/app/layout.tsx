import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from '@/components/NavBar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CredLink - Your credentials, verified and trusted on-chain",
  description: "Allow users to upload their credentials and issuers to verify them on the blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen bg-gray-50 pt-28">
          {children}
        </main>
      </body>
    </html>
  );
} 