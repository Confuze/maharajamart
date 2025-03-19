import { NextResponse } from "next/server";
import intl from "./middlewares/intl";
import { auth } from "@/auth";

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
