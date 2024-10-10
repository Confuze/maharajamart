"use server";

import { PrismaClient } from "@prisma/client";

export async function markAsShipped(id: string, unMark: boolean = false) {
  const prisma = new PrismaClient();

  await prisma.order.update({
    where: { id: id },
    data: {
      shipped: !unMark,
    },
  });
}
