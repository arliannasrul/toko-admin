import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/store"); 
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}