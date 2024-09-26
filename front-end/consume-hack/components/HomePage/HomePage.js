"use client"; // Mark this as a client component

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  // Handle button click
  const handleStartNow = () => {
    router.push("/sign-up"); // Navigate to the signup page (you can change the route)
  };

  return (
    <div className="poppins-regular relative flex flex-col items-center justify-center h-screen bg-black text-white overflow-x-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Image
          src="/cleanbites-new.jpg"
          alt="Logo"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="absolute top-6 right-24 flex space-x-6">
        <a
          href="#"
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Source
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Documentation
        </a>
      </div>

      {/* Main content */}
      <div className="text-center poppins-regular px-4 max-w-screen-xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Snap. Find the truth. Eat right.
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          From scan to insight, CleanBites AI helps you choose <br /> the best foods for you. Get started now
        </p>
        <a
          href="#_"
          onClick={handleStartNow}
          className="relative inline-flex items-center justify-start px-8 py-4 overflow-hidden font-bold rounded-full group"
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative text-md w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900 flex items-center">
            Try Now
            <span className="ml-2 relative flex items-center transition-transform duration-300 ease-in-out group-hover:translate-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </span>
          <span className="absolute inset-0 border-2 border-white rounded-full"></span>
        </a>
      </div>
    </div>
  );
}
