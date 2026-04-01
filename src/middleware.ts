import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /images, /favicon.ico, etc (static files)
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt|sitemap.xml).*)"],
};
