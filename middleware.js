import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create(.*)",
  "/course(.*)",
  "/payment-success(.*)",
]);

const isPublicApi = createRouteMatcher([
  "/api/inngest(.*)",
  "/api/payment/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApi(req)) return;
  if (isProtectedRoute(req) || req.nextUrl.pathname.startsWith("/api")) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
