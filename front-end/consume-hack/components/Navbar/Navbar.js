"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Tooltip } from "@mui/material";
import { Utensils, HeartPulse } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const { user } = useUser();
  const [isDetailsComplete, setIsDetailsComplete] = useState(false); // Track if user details are complete

  // Check if user details are complete when component loads
  useEffect(() => {
    const checkUserDetails = async () => {
      if (user) {
        try {
          const response = await fetch(`https://cleanbitesai.el.r.appspot.com/get-user-details/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Check if critical fields are filled
            if (data.name && data.age && data.height && data.weight) {
              setIsDetailsComplete(true);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    checkUserDetails();
  }, [user]);

  return (
    <nav className="bg-transparent p-4 fixed top-2 left-32 w-32 z-50 justify-center items-center md:flex md:flex-col md:w-16 rounded-full md:left-6 md:top-56 hidden">
      <div className="flex justify-center space-x-8 md:flex-col md:space-x-0 md:space-y-8">
        {/* Conditionally render the Food Details link based on whether details are complete */}
        {isDetailsComplete && (
          <Tooltip title="Food Details" placement="bottom">
            <Link href="/food-details" className="text-white hover:text-gray-400 flex flex-col items-center">
              <Utensils fontSize="large" />
            </Link>
          </Tooltip>
        )}

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
