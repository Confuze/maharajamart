// WARN: The url should be by id not slug because slug can change when the name changes

import { Button } from "@/src/components/ui/button";
import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import FeaturedButton from "@/src/components/FeaturedButton";
import ArchiveProductButton from "@/src/components/ArchiveProductButton";

export const dynamic = "force-dynamic";

export default async function Product({
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
    <div className="flex gap-8 w-2/3">
      {(product.imageUrl || product.imageStoredInFs) && (
        <div className="relative basis-1/3 max-h-[40vh] border-4 overflow-hidden border-secondary rounded-3xl">
          <Image
            className="object-contain text-[0] bg-white bg-cover"
            quality={75}
            fill
            src={
              product.imageStoredInFs
                ? `/api/publicAssets/uploads/${product.id}.webp`
                : product.imageUrl!
            }
            alt={product.name}
          />
        </div>
      )}
      <div className={product.imageUrl ? "basis-2/3" : ""}>
        <Link
          href={`/admin-maharajamart/categories/${product.category.slug}`}
          className="flex items-center gap-1 text-neutral-500 text-xl mb-2 hover:underline"
        >
          <ArrowLeft className="h-5" />
          Go back
        </Link>
        <h1 className="text-3xl">{product.name}</h1>
        <p className="text-neutral-500 mb-2">{product.category.name}</p>
        {product.archived && (
          <div className="flex gap-1 text-red-500 text-lg">
            <TriangleAlert />
            <h2 className="mb-2 ">This product has been archived</h2>
          </div>
        )}
        <p className="mb-8">Price: {product.price} zł</p>
        <p>Polish name: {product.namePl || "N/A"}</p>
        <p className="text-neutral-500 mt-2">Description:</p>
        <p>{product.description || "N/A"}</p>
        <p className="text-neutral-500 mt-2">Polish description:</p>
        <p>{product.descriptionPl || "N/A"}</p>
        <div className="mt-8 flex gap-2">
          <Link
            href={`/admin-maharajamart/categories/${product.category.slug}/${product.slug}/edit`}
            className="block"
          >
            <Button variant="outline">Edit product</Button>
          </Link>
          <FeaturedButton status={product.featured || false} id={product.id} />
          <ArchiveProductButton
            status={product.archived || false}
            id={product.id}
          />
        </div>
      </div>
    </div>
  );
}
