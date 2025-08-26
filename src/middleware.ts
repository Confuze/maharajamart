import { NextResponse } from "next/server";
import intl from "./middlewares/intl";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth({
  trustHost: true,
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin-maharajamart/login",
  },
  ...authConfig,
});

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/admin-maharajamart")) {
    const authenticated = !!req.auth && !!req.auth.user;

    console.log("midlleware:", req.auth);

    if (req.nextUrl.pathname.startsWith("/admin-maharajamart/login")) {
      if (authenticated) {
        return Response.redirect(
          new URL("/admin-maharajamart", req.nextUrl.origin),
        );
      } else return NextResponse.next();
    } else if (!authenticated) {
      return Response.redirect(
        new URL("/admin-maharajamart/login", req.nextUrl.origin),
      );
    } else return NextResponse.next();
  } else {
    return intl(req);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
