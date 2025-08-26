"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { changeStatus } from "../lib/changeStatus";
import { useRouter } from "next/navigation";
import { statusTitles } from "../lib/statusTitles";

export type Status =
  | "Waiting for shipping"
  | "In shipping"
  | "Delivered"
  | "Received"
  | "Cancelled";

export type Order = {
  dateOrdered: string;
  status: Status;
  name: string;
  town: string;
  price: number;
  id: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "dateOrdered",
    header: ({ column }) => {
      let icon = <ArrowUpDown className="ml-2 h-4 w-4" />;

      if (column.getIsSorted() === "asc")
        icon = <ArrowDown className="ml-2 h-4 w-4" />;
      if (column.getIsSorted() === "desc")
        icon = <ArrowUp className="ml-2 h-4 w-4" />;

      return (
        <Button
          variant="ghost"
          className="hover:bg-gray-200"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {icon}
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      let style = "";

      if (status == "Waiting for shipping")
        style = "bg-slate-200 text-slate-900";
      else if (status == "In shipping") style = "bg-orange-200 text-orange-900";
      else if (status == "Delivered") style = "bg-blue-200 text-blue-900";
      else if (status == "Received") style = "bg-lime-200 text-lime-900";
      else if (status == "Cancelled") style = "bg-red-200 text-red-900";

      return (
        <div
          className={`${style} w-fit px-3 py-[2px] rounded-full text-right font-bold`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "town",
    header: "Town",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      return (
        <div className="text-right font-medium">
          {(Math.round(amount * 100) / 100).toFixed(2)} zł
        </div>
      );
    },
  },

  {
    id: "actions",
    size: 32,
    cell: ({ row }) => {
      const { id, status } = row.original;

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
              <Link href={`/admin-maharajamart/orders/${id}`}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Set status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {(
                    Object.keys(statusTitles) as Array<
                      keyof typeof statusTitles
                    >
                  ).map((key, index) => {
                    let style = "";
                    const statusText = statusTitles[key];

                    if (statusText == "Waiting for shipping")
                      style = "bg-slate-200 text-slate-900";
                    else if (statusText == "In shipping")
                      style = "bg-orange-200 text-orange-900";
                    else if (statusText == "Delivered")
                      style = "bg-blue-200 text-blue-900";
                    else if (statusText == "Received")
                      style = "bg-lime-200 text-lime-900";
                    else if (statusText == "Cancelled")
                      style = "bg-red-200 text-red-900";

                    const disabled = status == statusText;

                    const router = useRouter();

                    return (
                      <DropdownMenuItem
                        className={`${style} ${index != 0 && "mt-1"} ${disabled && "opacity-50"} p-0`}
                        key={key}
                      >
                        <button
                          disabled={disabled}
                          className="block w-full h-full text-left py-2 px-3"
                          onClick={async () => {
                            await changeStatus(id, key);
                            router.refresh();
                          }}
                        >
                          {statusText}
                          {disabled && <Check className="inline ml-3" />}
                        </button>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
