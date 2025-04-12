"use client"

import * as React from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react"

function Footer() {
  return (
    <footer className="relative border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground">
              Join our newsletter for the latest updates on blockchain credential verification.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-indigo-600 text-white transition-transform hover:scale-105"
              >
                <Send className="mx-auto h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-indigo-600/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-indigo-600">
                Home
              </Link>
              <Link href="/login" className="block transition-colors hover:text-indigo-600">
                Login
              </Link>
              <Link href="/register" className="block transition-colors hover:text-indigo-600">
                Register
              </Link>
              <Link href="/dashboard" className="block transition-colors hover:text-indigo-600">
                Dashboard
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>1234 Arihant Vishar</p>
              <p>New Delhi</p>
              <p>Phone: (+91) 456-7890</p>
              <p>Email: dishankchauhan29@gmail.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <a 
                href="#" 
                className="rounded-full border border-gray-300 p-2 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="rounded-full border border-gray-300 p-2 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="rounded-full border border-gray-300 p-2 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="rounded-full border border-gray-300 p-2 transition-colors hover:border-indigo-600 hover:text-indigo-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 CredLink. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="/privacy" className="transition-colors hover:text-indigo-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-indigo-600">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footer } 