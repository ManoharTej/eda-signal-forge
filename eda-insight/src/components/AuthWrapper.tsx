// src/components/AuthWrapper.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/canvas/Navbar";

import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  
  // Logic: Is the user currently on the Auth screen?
  const isAuthPage = pathname === "/auth";

  useEffect(() => {
    // When switching from Auth to Home, we animate the content's entry
    if (!isAuthPage) {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.5 }
      );
    }
  }, [isAuthPage]);

  return (
    <>
      {/* ANIMATED NAVBAR 
          AnimatePresence ensures the Navbar slides out smoothly 
          when you go back to the login screen.
      */}
      <AnimatePresence mode="wait">
        {!isAuthPage && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1] // Custom Expo Out Easing
            }}
            className="fixed top-0 left-0 w-full z-[100]"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC VIEWPORT
          If it's an Auth page, we use the full screen (pt-0).
          If it's a Dashboard page, we add padding (pt-28) 
          so the Navbar doesn't cover the 3D Header.
      */}
      <main 
        ref={mainRef}
        className={`relative z-10 min-h-screen transition-all duration-1000 ease-in-out ${
          isAuthPage ? "pt-0" : "pt-28"
        }`}
      >
        {children}
      </main>
    </>
  );
}


