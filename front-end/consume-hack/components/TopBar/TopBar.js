import React from 'react'
import { UserButton } from "@clerk/nextjs"; // Import Clerk's UserButton

function TopBar() {
  return (
    <div>
        <div className="absolute top-4 right-4">
          <UserButton afterSignOutUrl="/signin" />
        </div>
    </div>
  )
}

export default TopBar