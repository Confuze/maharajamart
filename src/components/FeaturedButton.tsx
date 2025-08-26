// TODO: fix error states with useActionState

"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { updateFeatured } from "../lib/updateFeatured";

export default function FeaturedButton({
  status,
  id,
}: {
  status: boolean;
  id: string;
}) {
  const router = useRouter();

  const markAsFeatured = async (newStatus: boolean) => {
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
      const result = await updateFeatured(newStatus, id);

      if (result.success) {
        promiseResolve!();
        router.refresh();
      } else {
        promiseReject!();
        if (result.error === "TOO_MANY")
          toast.error("Too many featured products", {
            description:
              "You can't add more than 20 featured products. Please remove some to add new ones",
          });
      }
    } catch (error) {
      promiseReject!();
      console.error(error);
    }
  };

  return (
    <Button
      onClick={() => {
        markAsFeatured(!status);
      }}
      variant="outline"
      className="bg-blue-200 text-blue-900"
    >
      {status ? "Remove from featured products" : "Add to featured products"}
    </Button>
  );
}
