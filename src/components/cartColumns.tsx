"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type Item = {
  product: string;
  productURL: string;
  quantity: number;
};

export const cartColumns: ColumnDef<Item>[] = [
  {
    id: "index",
    size: 10,
    cell: ({ row }) => {
      const index = row.index + 1;

      return <div className="text-right font-medium">{index}</div>;
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const url = row.original.productURL;
      const product = row.getValue("product") as string;

      return (
        <Link
          className="hover:underline text-blue-500"
          target="_blank"
          href={url}
        >
          {product}
        </Link>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right mr-28">Quantity</div>,
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as string;

      return <div className="text-right mr-28">{quantity}</div>;
    },
  },
];
