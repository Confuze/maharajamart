"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

export type Product = {
  name: string;
  publicProductURL: string;
  productURL: string;
  price: number;
};

export const categoryColumns: ColumnDef<Product>[] = [
  {
    id: "index",
    size: 10,
    cell: ({ row }) => {
      const index = row.index + 1;

      return <div className="text-right font-medium">{index}</div>;
    },
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
    accessorKey: "price",
    header: () => <div className="text-right mr-28">Price</div>,
    cell: ({ row }) => {
      const price = row.getValue("price") as string;

      return <div className="text-right mr-28">{price} zł</div>;
    },
  },
  {
    id: "actions",
    size: 32,
    cell: ({ row }) => {
      const { publicProductURL, productURL } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-end">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={productURL}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`${productURL}/edit`}>Edit product</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={publicProductURL} target="_blank">
                See product page
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
