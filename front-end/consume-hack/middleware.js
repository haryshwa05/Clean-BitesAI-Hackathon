import { clerkMiddleware } from "@clerk/nextjs/server";  // Replace authMiddleware with clerkMiddleware

export default clerkMiddleware({
  publicRoutes: ["/signin", "/signup"], // Routes that can be accessed without authentication
});

export const config = {
  matcher: ["/dashboard", "/user-details", "/"], // Protect these routes (including home)
};
