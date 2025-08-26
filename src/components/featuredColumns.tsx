"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import RemoveFromFeatured from "./RemoveFromFeatured";

export type FeaturedProduct = {
  name: string;
  category: string;
  productURL: string;
  productId: string;
};

export const featuredColumns: ColumnDef<FeaturedProduct>[] = [
  {
    id: "index",
    size: 10,
    cell: ({ row }) => {
      const index = row.index + 1;

      return <div className="text-right font-medium">{index}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const url = row.original.productURL;
      const product = row.getValue("name") as string;

      return (
        <Link className="hover:underline text-blue-500" href={url}>
          {product}
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.productId;

      return <RemoveFromFeatured id={id} />;
    },
  },
];
