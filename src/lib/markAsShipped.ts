"use server";

import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

export async function markAsShipped(id: string, unMark: boolean = false) {
  const prisma = new PrismaClient();

  const headerList = await headers();

  const auth =
    headerList.get("authorization") || headerList.get("Authorization");

  if (!auth) {
    throw new Error("Authentication required");
  }

  const [user, pass] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    await prisma.order
      .update({
        where: { id: id },
        data: {
          shipped: !unMark,
        },
      })
      .catch((error) => {
        Response.json(
          {
            status: "500 Interval server error",
            message:
              "Updating database entry failed. Most likely because an object with the given ID does not exist\nError message:\n" +
              error,
          },
          { status: 500 },
        );
      });

    prisma.$disconnect();

    return "Succesfully updated database entry";
  } else {
    throw new Error("access denied");
  }
}
