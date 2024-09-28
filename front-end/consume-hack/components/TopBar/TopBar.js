import React from 'react';
import { UserButton, useUser } from "@clerk/nextjs"; // Import Clerk's UserButton and useUser hook

function TopBar() {
  const { user } = useUser(); // Get the logged-in user's information

  return (
    <div className="flex items-center justify-between absolute top-4 poppins-regular w-full">
      <div className='ml-5'>
        {/* Logo on the left side */}
        <img src="/cleanbites-trans.png" alt="Logo" className="w-26 h-16" /> 

      </div>
      
      <div className='mr-12'>
      {/* Greeting text and User button on the right side */}
      <div className="flex items-center">
        <span className="text-lg text-white font-semibold mr-4">
          Hi {user?.firstName}!
        </span>

        <UserButton
          afterSignOutUrl="/signin"
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-10 h-10', // Adjusts the size of the avatar
              userButtonBox: 'w-16 h-16', // Adjusts the overall button box size
            },
          }}
        />
      </div>
      </div>
    </div>
  );
}

export default TopBar;
