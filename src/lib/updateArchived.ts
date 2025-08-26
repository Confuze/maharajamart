"use server";

import { auth } from "@/auth";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateArchived(newStatus: boolean, id: string) {
  const session = auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.product.update({
    where: { id },
    data: { archived: newStatus },
  });

  revalidatePath(`/[locale]/(global)/products/[category]`, "page");
  revalidatePath(`/[locale]/(global)/products/all/[page]`, "page");
  revalidatePath(`/[locale]/(global)/products/[category]/[slug]`, "page");
}
