import { NextRequest, NextResponse } from "next/server";

export default function basicAuth(req: NextRequest) {
  const auth =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!auth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  const [user, pass] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    // Proceed to admin panel
    NextResponse.next();
  } else {
    return new NextResponse("Access denied", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}
