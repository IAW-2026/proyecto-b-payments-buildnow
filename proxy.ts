import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/api(.*)',
  '/success(.*)',
  '/pending(.*)',
  '/failure(.*)',
  '/unauthorized'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();

    const { sessionClaims } = await auth();
    const isAdmin = sessionClaims?.metadata?.role?.includes('admin');

    if (!isAdmin) {
      return Response.redirect(new URL('/unauthorized', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};