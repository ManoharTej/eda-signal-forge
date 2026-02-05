// src/app/layout.tsx
import "./globals.css";
import NeuralBackground from "@/components/canvas/NeuralBackground";
import { AuthProvider } from "@/context/AuthContext";
import AuthWrapper from "@/components/AuthWrapper"; 
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EDA Insight | Neural Research Portal",
  description: "Advanced Electrodermal Activity Analysis & Real-time Telemetry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased selection:bg-blue-500/30 overflow-x-hidden`}>
        {/* We wrap everything in AuthProvider so the user session is accessible everywhere */}
        <AuthProvider>
          
          {/* Layer 0: The Higgs-Field 3D Background (Stays fixed behind everything) */}
          <NeuralBackground />
          
          {/* Layer 1: The Logic Gate 
              This component (which we create next) will decide when to show the Navbar */}
          <AuthWrapper>
            {children}
          </AuthWrapper>
          
        </AuthProvider>
      </body>
    </html>
  );
}
