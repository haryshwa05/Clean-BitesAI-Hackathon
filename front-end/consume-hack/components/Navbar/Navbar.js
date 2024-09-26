"use client";

import React, { useState } from "react";
import { Menu, Close } from "@mui/icons-material"; // Import Material UI Icons for mobile menu
import { UserButton } from "@clerk/nextjs"; // Import Clerk's UserButton
import { Tooltip } from "@mui/material"; // Import Material UI Tooltip
import { Utensils, HeartPulse } from "lucide-react"; // Import icons from lucide-react
import Link from "next/link"; // Import Next.js Link component

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black p-2 fixed mt-24 left-6 w-full md:w-16  z-50 flex md:flex-col md:justify-between rounded-t-3xl rounded-b-3xl md:rounded-full">
      <div className="container mx-auto md:hidden flex justify-between items-center">
        {/* Hamburger Menu for mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="text-white focus:outline-none"
          >
            {isOpen ? <Close style={{ fontSize: 30 }} /> : <Menu style={{ fontSize: 30 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-black p-4">
          <Link href="/user-details" className="block text-white hover:bg-gray-700 py-2 px-4 rounded">
            Your Details
          </Link>
          <Link href="/food-details" className="block text-white hover:bg-gray-700 py-2 px-4 rounded">
            Food Details
          </Link>
          <div className="py-2 px-4 text-white hover:bg-gray-700 rounded">
            <UserButton afterSignOutUrl="/signin" /> {/* Clerk's UserButton for mobile */}
          </div>
        </div>
      )}

      {/* Sidebar for larger screens */}
      <div className="hidden md:flex flex-col justify-between items-center h-full p-4">
        {/* Empty div with flex-grow to push items to the center */}
        <div className="flex-grow"></div>

        {/* Centered Nav Links */}
        <div className="flex flex-col items-center space-y-8">
          <Tooltip title="Your Details" placement="right">
            <Link href="/user-details" className="text-white hover:text-gray-400">
              <HeartPulse fontSize="large" /> {/* Replacing with HeartPulse icon */}
            </Link>
          </Tooltip>

          <Tooltip title="Food Details" placement="right">
            <Link href="/food-details" className="text-white hover:text-gray-400">
              <Utensils fontSize="large" /> {/* Replacing with Utensils icon */}
            </Link>
          </Tooltip>
        </div>

        {/* Empty div to balance the UserButton being at the bottom */}
        <div className="flex-grow"></div>

        {/* Push UserButton to the bottom */}
        
      </div>
    </nav>
  );
};

export default Navbar;
