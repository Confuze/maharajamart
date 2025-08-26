"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { statusTitles } from "@/src/lib/statusTitles";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { changeStatus } from "@/src/lib/changeStatus";
import { Check } from "lucide-react";
import { Status } from "@prisma/client";
import { Button } from "./ui/button";

export default function ChangeStatus({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Change status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(Object.keys(statusTitles) as Array<keyof typeof statusTitles>).map(
          (key, index) => {
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

            const disabled = status == key;

            return (
              <DropdownMenuItem
                className={`${style} ${index != 0 && "mt-1"} ${disabled && "opacity-50"} p-0`}
                key={key}
                asChild
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
          },
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
