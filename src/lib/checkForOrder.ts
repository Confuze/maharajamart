"use server";
import { PrismaClient } from "@prisma/client";

export async function checkForPaidOrder(id: string) {
  const prisma = new PrismaClient();
  const currentOrder = await prisma.order.findUnique({
    where: {
      cartId: id,
      paid: true,
    },
  });

  prisma.$disconnect();
  if (currentOrder) return true;
  else return false;
}
