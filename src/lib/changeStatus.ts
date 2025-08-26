"use server";

import { auth } from "@/auth";
import prisma from "./prisma";
import { Status } from "@prisma/client";

export async function changeStatus(id: string, status: Status) {
  const session = auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.order
    .update({
      where: { id: id },
      data: {
        status: status,
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

  return "Succesfully updated database entry";
}
