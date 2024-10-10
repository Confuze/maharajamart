import { NextRequest, NextResponse } from "next/server";
import basicAuth from "./middlewares/auth";
import intl from "./middlewares/intl";

export default function middleware(req: NextRequest) {
  const ignoreRegex = RegExp(
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  );

  if (!ignoreRegex.test(req.nextUrl.pathname)) {
    console.log(req.nextUrl.pathname, ": non-localised");
    return NextResponse.next();
  }

  console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname.includes("/admin-maharajamart")) {
    return basicAuth(req);
  } else {
    return intl(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
