"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export async function markAsShipped(id: string, unMark: boolean = false) {
  const prisma = new PrismaClient();

  const session = auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.order
    .update({
      where: { id: id },
      data: {
        shipped: !unMark,
      },
    })
    .catch((error) => {
      return Response.json(
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
}
