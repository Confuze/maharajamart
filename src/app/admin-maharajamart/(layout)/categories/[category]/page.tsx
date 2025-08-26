import { categoryColumns, Product } from "@/src/components/categoryColumns";
import { auth } from "@/auth";
import { DataTable } from "@/src/components/ui/data-table";
import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Category({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const category = await prisma.category.findUnique({
    where: { slug: (await params).category },
  });
  if (!category) return notFound();

  const products = await prisma.product.findMany({
    where: { archived: false, categoryId: category.id },
    select: { slug: true, name: true, id: true, price: true },
  });

  const archived = await prisma.product.findMany({
    where: { archived: true },
    select: { slug: true, name: true, id: true, price: true },
  });

  const data: Product[] = await Promise.all(
    products.map(async (product) => {
      return {
        name: product.name,
        price: product.price,
        publicProductURL: `/products/${category.slug}/${product.slug}`,
        productURL: `/admin-maharajamart/categories/${category.slug}/${product.slug}`,
      };
    }),
  );

  const archivedData: Product[] = await Promise.all(
    archived.map(async (product) => {
      return {
        name: product.name,
        price: product.price,
        publicProductURL: `/products/${category.slug}/${product.slug}`,
        productURL: `/admin-maharajamart/categories/${category.slug}/${product.slug}`,
      };
    }),
  );

  return (
    <>
      <Link
        href={"/admin-maharajamart/categories/"}
        className="flex items-center gap-1 text-neutral-500 text-xl mb-2 hover:underline"
      >
        <ArrowLeft className="h-5" />
        Go back
      </Link>
      <h1 className="text-2xl">Products in category: {category.name}</h1>
      <p className="text-neutral-500 mb-4">{products.length} products</p>
      <DataTable pagination filtered columns={categoryColumns} data={data} />
      <h1 className="text-2xl mt-8">Archived products</h1>
      <p className="text-neutral-500 mb-4">{archived.length} products</p>
      <DataTable
        pagination
        filtered
        columns={categoryColumns}
        data={archivedData}
      />
    </>
  );
}
