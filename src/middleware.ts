export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/listings/new',
    '/listings/:id/edit',
    '/bookings/:path*',
    '/messages/:path*',
    '/profile/:path*',
  ],
};