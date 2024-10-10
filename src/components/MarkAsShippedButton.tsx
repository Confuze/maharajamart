"use client";

import { markAsShipped } from "../lib/markAsShipped";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function MarkAsShippedButton({
  id,
  unMark = false,
}: {
  id: string;
  unMark?: boolean;
}) {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await markAsShipped(id, unMark);
        router.refresh();
      }}
    >
      {unMark ? "Mark as not shipped" : "Mark as shipped"}
    </Button>
  );
}

export default MarkAsShippedButton;
