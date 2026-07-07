import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const productionOrigins = [
  "https://www.storage2u.ca",
  "https://storage2u.ca",
  "https://accounts.storage2u.ca",
]

if (process.env.VERCEL_URL) {
  productionOrigins.push(`https://${process.env.VERCEL_URL}`)
}

const authorizedParties =
  process.env.NODE_ENV === "production"
    ? productionOrigins
    : ["http://localhost:3000"]

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, { authorizedParties });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
