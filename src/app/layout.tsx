import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VerifyChain - Your credentials, verified and trusted on-chain",
  description: "Allow users to upload their credentials and issuers to verify them on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">VerifyChain</h1>
                <nav className="flex space-x-4">
                  <a href="/" className="hover:text-indigo-200">Home</a>
                  <a href="/dashboard" className="hover:text-indigo-200">Dashboard</a>
                  <a href="/credentials" className="hover:text-indigo-200">Credentials</a>
                  <a href="/login" className="hover:text-indigo-200">Login</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-100 border-t">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center text-gray-500">&copy; 2025 VerifyChain. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 