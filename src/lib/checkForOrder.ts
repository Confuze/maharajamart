"use server";

import prisma from "./prisma";

export async function checkForPaidOrder(id: string) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  }); // sleeps for 1s to make sure mongodb order has already been updated (dumb)

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
