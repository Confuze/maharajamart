"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { updateFeatured } from "../lib/updateFeatured";
import { toast } from "sonner";

export default function RemoveFromFeatured({ id }: { id: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="bg-red-200 text-red-900"
      onClick={async () => {
        let promiseResolve, promiseReject;

        const promise = new Promise((resolve, reject) => {
          promiseResolve = resolve;
          promiseReject = reject;
        });

        toast.promise(promise, {
          loading: "Removing from featured",
          success: "Product removed from featured",
          error: "Failed to remove product from featured",
        });

        try {
          await updateFeatured(false, id);
          promiseResolve!();
          router.refresh();
        } catch (error) {
          promiseReject!();
          console.error(error);
        }
      }}
    >
      Remove from featured
    </Button>
  );
}
