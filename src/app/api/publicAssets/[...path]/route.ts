// TODO: Check if images are still wrongly cached in prod build
//       Set image path to uuid instead of product id

// courtesy of https://github.com/vercel/next.js/discussions/16417#discussioncomment-11647448

import fs from "fs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const dir = (await params).path.join("/");
  const filePath = path.join(process.cwd(), "public", dir);
  if (!dir) {
    return new NextResponse(null, { status: 500 });
  }

  console.log(dir, filePath);

  // Prevent path traversal attacks
  if (dir.indexOf("..") >= 0) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const stats = fs.statSync(filePath);

    const lastModified = stats.mtime.toUTCString();
    const fileSize = stats.size;

    // Generate ETag based on file size and modification time
    const eTag = crypto
      .createHash("md5")
      .update(`${fileSize}-${lastModified}`)
      .digest("hex");

    // Check if the client has a cached version
    if (
      req.headers.get("if-none-match") === eTag ||
      req.headers.get("if-modified-since") === lastModified
    ) {
      return new NextResponse(null, { status: 304 }); // Not Modified
    }

    const data = fs.readFileSync("public/" + dir, { flag: "r" });

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=0",
        "Last-Modified": lastModified,
        ETag: eTag,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      if ("code" in e && e.code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to read file", message: e.message },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to read file", message: e },
        { status: 500 },
      );
    }
  }
}
