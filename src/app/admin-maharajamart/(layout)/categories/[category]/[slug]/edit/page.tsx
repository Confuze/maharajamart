import { auth } from "@/auth";
import UpdateForm from "@/src/components/UpdateForm";
import prisma from "@/src/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Edit({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  const { category, slug } = await params;

  const product = await prisma.product.findUnique({
    where: { category: { slug: category }, slug: slug },
    include: { category: true },
  });

  if (!product) return notFound();

  return (
    <div className="lg:w-1/2">
      <Link
        href={`/admin-maharajamart/categories/${product.category.slug}/${product.slug}`}
        className="flex items-center gap-1 text-neutral-500 text-xl mb-2 hover:underline"
      >
        <ArrowLeft className="h-5" />
        Go back
      </Link>
      <h1 className="text-3xl mb-4">Edit product</h1>
      <UpdateForm product={product} />
    </div>
  );
}
