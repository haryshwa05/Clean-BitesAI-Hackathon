"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs"; // Import Clerk's UserButton
import { Tooltip } from "@mui/material"; // Import Material UI Tooltip
import { Utensils, HeartPulse, LayoutDashboard } from "lucide-react"; // Import icons from lucide-react
import Link from "next/link"; // Import Next.js Link component

const Navbar = () => {
  return (
    <nav className="bg-transparent p-4 fixed top-2 left-32 w-32 z-50 flex justify-center md:justify-between items-center md:flex-col md:w-16 rounded-full md:left-6 md:top-56">
      {/* Horizontal Navbar for mobile screens */}
      <div className="flex justify-center space-x-8 md:flex-col md:space-x-0 md:space-y-8">
        <Tooltip title="Previous Searches" placement="bottom">
          <Link href="/food-details" className="text-white hover:text-gray-400 flex flex-col items-center">
            <LayoutDashboard fontSize="large" />

          </Link>
        </Tooltip>


        <Tooltip title="Food Details" placement="bottom">
          <Link href="/food-details" className="text-white hover:text-gray-400 flex flex-col items-center">
            <Utensils fontSize="large" />

          </Link>
        </Tooltip>

        <Tooltip title="Your Details" placement="bottom">
          <Link href="/user-details" className="text-white hover:text-gray-400 flex flex-col items-center">
            <HeartPulse fontSize="large" />

          </Link>
        </Tooltip>

      </div>

    </nav>


  );
};

export default Navbar;
