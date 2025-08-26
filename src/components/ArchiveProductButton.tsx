"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { updateArchived } from "../lib/updateArchived";

export default function ArchiveProductButton({
  status,
  id,
}: {
  status: boolean;
  id: string;
}) {
  const router = useRouter();

  const markAsArchived = async (newStatus: boolean) => {
    let promiseResolve, promiseReject;

    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    toast.promise(promise, {
      loading: "Updating product",
      success: "Product updated",
      error: "Failed to update product",
    });

    try {
      await updateArchived(newStatus, id);
      promiseResolve!();
      router.refresh();
    } catch (error) {
      console.log(error);
      console.log("test");
      promiseReject!();
      console.error(error);
    }
  };

  return (
    <Button
      onClick={() => {
        markAsArchived(!status);
      }}
      variant="outline"
      className="bg-red-200 text-red-900"
    >
      {status ? "Remove from archive" : "Archive"}
    </Button>
  );
}
