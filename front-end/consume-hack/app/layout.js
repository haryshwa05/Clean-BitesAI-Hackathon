"use client";

import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider for client-side
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import TopBar from "@/components/TopBar/TopBar";


export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Conditionally show the Navbar and TopBar based on the path
  const showNavbar = !["/signin", "/signup", "/", "/sign-up"].includes(pathname);
  const showTopBar = showNavbar; // Same condition for TopBar

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className="bg-cover" style={{ backgroundImage: "url('/background-6.jpg')" }}>
          {/* Conditionally render the Navbar */}
          {showNavbar && <Navbar />}

          {/* Conditionally render the TopBar */}
          {showTopBar && <TopBar />}

          {/* Ensure that content starts below the Navbar if it's shown */}
          <main className={showNavbar ? "md:pl-14" : ""}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
