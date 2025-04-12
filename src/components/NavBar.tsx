"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Home, FileCheck, User, LogOut, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUserData, signOut } from "@/utils/authService"
import { auth } from "@/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  requiresAuth: boolean
  action?: () => void;
}

interface NavBarProps {
  className?: string
}

export function NavBar({ className }: NavBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Check auth status on mount and auth state changes
  useEffect(() => {
    // Use Firebase's onAuthStateChanged for reliable auth status
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
        setUserEmail(user.email || "");
        
        // Get additional user data if needed
        try {
          const userData = await getCurrentUserData();
          if (userData) {
            // Update with any additional user data
            setUserEmail(userData.email || user.email || "");
          }
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setUserEmail("");
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Set the active tab based on the current path
  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('Home')
    } else if (pathname === '/dashboard') {
      setActiveTab('Dashboard')
    } else if (pathname === '/credentials' || pathname.startsWith('/credentials')) {
      setActiveTab('Credentials')
    } else if (pathname === '/profile') {
      setActiveTab('Profile')
    } else if (pathname === '/login') {
      setActiveTab('Login')
    } else if (pathname === '/register') {
      setActiveTab('Register')
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await signOut();
      // We don't need to manually set states here as onAuthStateChanged will handle it
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Define navigation items
  const publicItems: NavItem[] = [
    { name: 'Home', url: '/', icon: Home, requiresAuth: false },
    { name: 'Login', url: '/login', icon: User, requiresAuth: false },
    { name: 'Register', url: '/register', icon: FileCheck, requiresAuth: false },
  ]
  
  const privateItems: NavItem[] = [
    { name: 'Home', url: '/', icon: Home, requiresAuth: false },
    { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
    { name: 'Credentials', url: '/credentials', icon: FileCheck, requiresAuth: true },
    { name: 'Logout', url: '#', icon: LogOut, requiresAuth: true, action: handleLogout },
  ]

  const items = isLoggedIn ? privateItems : publicItems;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 mt-4 px-4",
        className,
      )}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-indigo-600 font-bold text-xl flex items-center"
          // Don't change active tab when clicking the logo
          onClick={(e) => e.stopPropagation()}
        >
          CredLink
        </Link>
        
        <div className="flex items-center gap-2">
          {isLoggedIn && userEmail && (
            <div className="mr-4 hidden md:block">
              <span className="text-sm text-gray-600">
                <User size={14} className="inline-block mr-1" />
                {userEmail}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-white/90 border border-gray-200 backdrop-blur-lg py-1 px-2 rounded-full shadow-lg">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <div key={item.name}>
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={cn(
                        "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                        "text-gray-600 hover:text-indigo-600",
                        isActive && "bg-gray-100 text-indigo-600",
                      )}
                    >
                      <span className="hidden md:inline">{item.name}</span>
                      <span className="md:hidden">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      onClick={() => setActiveTab(item.name)}
                      className={cn(
                        "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                        "text-gray-600 hover:text-indigo-600",
                        isActive && "bg-gray-100 text-indigo-600",
                      )}
                    >
                      <span className="hidden md:inline">{item.name}</span>
                      <span className="md:hidden">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="lamp"
                          className="absolute inset-0 w-full bg-indigo-50 rounded-full -z-10"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-t-full">
                            <div className="absolute w-12 h-6 bg-indigo-200/50 rounded-full blur-md -top-2 -left-2" />
                            <div className="absolute w-8 h-6 bg-indigo-200/50 rounded-full blur-md -top-1" />
                            <div className="absolute w-4 h-4 bg-indigo-200/50 rounded-full blur-sm top-0 left-2" />
                          </div>
                        </motion.div>
                      )}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 