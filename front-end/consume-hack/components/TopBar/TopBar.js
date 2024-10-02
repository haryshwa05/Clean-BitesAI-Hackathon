"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { UserButton, useUser } from "@clerk/nextjs";
import { Tooltip } from "@mui/material";
import { Utensils, HeartPulse, Menu } from "lucide-react";
import Link from "next/link";

function TopBar() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="flex items-center justify-between absolute top-4 poppins-regular w-full">
      <div className="ml-5">
        {/* Logo on the left side */}
        <Image
          src="/cleanbites-trans.png"
          alt="Logo"
          className="w-22 h-12 md:w-26 md:h-16"
        />
      </div>

      <div className="flex items-center ml-auto pr-4 md:pr-12">
        <span className="hidden md:inline-block text-sm md:text-lg text-white font-semibold mr-4">
          Hi {user?.firstName}!
        </span>


        {/* Hamburger menu for small screens */}
        <div className="md:hidden relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <Menu size={28} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-lg shadow-lg z-50">
              <div className="flex flex-col p-2">
                {isDetailsComplete && (
                  <Tooltip title="Food Details" placement="left">
                    <Link href="/food-details" className="text-white hover:text-gray-600 flex items-center py-2">
                      <Utensils className="mr-2" /> Food Details
                    </Link>
                  </Tooltip>
                )}

                <Tooltip title="Your Details" placement="left">
                  <Link href="/user-details" className="text-white hover:text-gray-600 flex items-center py-2">
                    <HeartPulse className="mr-2" /> Your Details
                  </Link>
                </Tooltip>
                <div className="border-t my-2"></div>
                <UserButton
                  afterSignOutUrl="/signin"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex">
          <UserButton
            signOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-10 h-10',
                userButtonBox: 'w-16 h-16',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TopBar;
