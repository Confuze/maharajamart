import {
  featuredColumns,
  FeaturedProduct,
} from "@/src/components/featuredColumns";
import { DataTable } from "@/src/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import prisma from "@/src/lib/prisma";
import { Info } from "lucide-react";

export default async function Featured() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    select: { name: true, category: true, id: true, slug: true },
  });

  const data = products.map((product): FeaturedProduct => {
    return {
      name: product.name,
      productId: product.id,
      category: product.category.name,
      productURL: `/admin-maharajamart/categories/${product.category.slug}/${product.slug}`,
    };
  });

  return (
    <>
      <div className="flex gap-1">
        <h1 className="text-2xl">Featured products</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-96 p-4">
              <p className="text-neutral-500">
                The featured products you choose here will be displayed in the
                featured section of the home page. You can add at most 20
                featured products. It is recommended to add at least 10
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-neutral-500 mb-4">{products.length} products</p>

      <DataTable pagination filtered columns={featuredColumns} data={data} />
    </>
  );
}
