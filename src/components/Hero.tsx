'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { WorldMap } from "./ui/world-map";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample dots for global connection visuals
const connectionDots = [
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 51.5074, lng: -0.1278 },  // London
  },
  {
    start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    end: { lat: 22.3193, lng: 114.1694 },  // Hong Kong
  },
  {
    start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    end: { lat: 19.4326, lng: -99.1332 },   // Mexico City
  },
  {
    start: { lat: -33.8688, lng: 151.2093 }, // Sydney
    end: { lat: 1.3521, lng: 103.8198 },    // Singapore
  },
  {
    start: { lat: 48.8566, lng: 2.3522 }, // Paris
    end: { lat: 55.7558, lng: 37.6173 },  // Moscow
  },
];

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const router = useRouter();
  const titles = useMemo(
    () => ["verified", "trusted", "secure", "blockchain", "immutable"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full relative overflow-hidden bg-white -mt-28 pt-28">
      {/* World Map Background */}
      <div className="absolute inset-0 z-0">
        <WorldMap dots={connectionDots} lineColor="#4338ca" />
      </div>
      
      {/* Light Gradient Overlay (barely visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto">
          <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
            <div>
              <Button variant="secondary" size="sm" className="gap-4">
                Blockchain-verified credentials <Shield className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                <span className="text-indigo-900">Your credentials,</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute font-semibold text-indigo-600"
                      initial={{ opacity: 0, y: "-100" }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? -150 : 150,
                              opacity: 0,
                            }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-2xl text-center mt-8">
                CredLink is your secure digital credential management system, 
                powered by blockchain technology to ensure your credentials are 
                verifiable, tamper-proof, and always accessible.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <InteractiveHoverButton 
                text="Login" 
                className="w-40" 
                onClick={() => router.push('/login')} 
              />
              <InteractiveHoverButton 
                text="Register" 
                className="w-40 bg-indigo-600 text-white" 
                onClick={() => router.push('/register')} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero }; 