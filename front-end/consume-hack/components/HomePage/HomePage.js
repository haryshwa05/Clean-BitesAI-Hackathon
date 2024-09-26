"use client"; // Mark this as a client component

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  // Handle button click for "Try Now"
  const handleStartNow = () => {
    router.push("/sign-up"); // Navigate to the signup page (you can change the route)
  };

  // Handle navigation for "Watch Demo"
  const handleWatchDemo = () => {
    router.push("/watch-demo"); // Navigate to the watch demo page (change the route as needed)
  };

  return (
    <div
      className="poppins-regular relative flex flex-col items-center justify-center h-screen text-white overflow-x-hidden"
      style={{
        backgroundImage: "url('/landing-page.jpg  ')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <Image
          src="/cleanbites-new.jpg"
          alt="Logo"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="absolute top-6 right-24 flex space-x-6 z-10">
        <a
          href="#"
          className="text-white hover:text-gray-300 transition-colors duration-200 hover:underline"
        >
          Source
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-300 transition-colors duration-200 hover:underline"
        >
          Documentation
        </a>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center poppins-regular px-4 max-w-screen-xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Snap. Find the truth. Eat right.
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          From scan to insight, CleanBites AI helps you choose <br /> the best foods for you. Get started now
        </p>

        {/* Buttons Container */}
        <div className="flex space-x-4 justify-center">
          {/* Try Now Button (Reverted to Previous State) */}
          <a
            href="#_"
            onClick={handleStartNow}
            className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full border-2 border-white transition-all duration-200 hover:bg-white hover:text-black"
          >
            Try Now
          </a>

          {/* Watch Demo Button with New Hover Effect */}
          <a
            href="#"
            onClick={handleWatchDemo}
            className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
              Watch Demo
            </span>
            <span className="relative invisible">Watch Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
