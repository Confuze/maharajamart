import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const categories = await prisma.category.findMany({
    where: { archived: false },
    select: { slug: true, name: true, id: true },
  });

  const archived = await prisma.category.findMany({
    where: { archived: true },
    select: { slug: true, name: true, id: true },
  });

  return (
    <>
      <h1 className="text-2xl">Categories</h1>
      <p className="text-neutral-500">{categories.length} categories</p>
      <div className="mt-6 mb-10 w-full grid grid-cols-4 gap-4">
        {categories.map(async (category) => {
          const count = await prisma.product.count({
            where: { categoryId: category.id },
          });

          return (
            <Link
              key={category.id}
              href={`/admin-maharajamart/categories/${category.slug}`}
            >
              <div className="w-full p-6 h-full border hover:bg-neutral-50 transition border-neutral-200 rounded-xl">
                <h2>{category.name}</h2>
                <p className="text-neutral-500">{count} products</p>
              </div>
            </Link>
          );
        })}
      </div>
      <h1 className="text-2xl">Archived categories</h1>
      <p className="text-neutral-500">{archived.length} categories</p>
      <div className="mt-4 w-full grid grid-cols-4 gap-4">
        {archived.map(async (category) => {
          const count = await prisma.product.count({
            where: { categoryId: category.id },
          });

          return (
            <Link
              key={category.id}
              href={`/admin-maharajamart/categories/${category.slug}`}
            >
              <div className="w-full p-6 h-full border border-neutral-200 rounded-xl">
                <h2>{category.name}</h2>
                <p className="text-neutral-500">{count} products</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
