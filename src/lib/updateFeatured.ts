"use server";

import { auth } from "@/auth";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateFeatured(newStatus: boolean, id: string) {
  const session = auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const count = await prisma.product.count({ where: { featured: true } });

  if (count >= 20 && newStatus) {
    return {
      success: false,
      error: "TOO_MANY",
      message:
        "The maximum amount of featured products (20) has already been reached. Please remove some before adding new ones",
    };
  }

  await prisma.product.update({ where: { id }, data: { featured: newStatus } });

  revalidatePath("/[locale]/(global)/");

  return { success: true };
}
