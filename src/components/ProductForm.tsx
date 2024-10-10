"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Product } from "../data/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { generateKey, useAppStore } from "../lib/storage";
import { useCartState } from "../lib/useStore";
import { toast } from "sonner";
import { Link } from "../navigation";

interface IFormProduct extends Product {
  productSlug: string;
  categorySlug: string;
}

function ProductForm({ product }: { product: IFormProduct }) {
  const t = useTranslations("Product");
  const t2 = useTranslations("Layout.products");
  const t3 = useTranslations("Cart");
  const { addCartItem } = useAppStore();
  const state = useCartState();

  const formSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1)
      .max(100)
      .refine(
        (val) => {
          const addedProductQuantity =
            state![generateKey(product.categorySlug, product.productSlug)]
              ?.quantity || 0;
          return val + addedProductQuantity <= 100;
        },
        {
          message: t("maxQuantity"),
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCartItem({
      productSlug: product.productSlug,
      categorySlug: product.categorySlug,
      quantity: values.quantity,
    });
    toast(t("added"), {
      description: t("addedDescription", {
        quantity: values.quantity,
        name: product.displayName,
      }),
      action: (
        <Link className="w-full basis-1/3" href="/cart">
          {/* Using basis is a hacky solution but it works and for whatever reason css won't let w-max or anything else work for this */}
          <Button variant="link" className="p-0 w-full">
            {t3("cart")}
          </Button>
        </Link>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-2 text-secondary font-serif text-4xl">
          {product.displayName}
        </h1>
        <p className="text-sm text-slate-700">{product.description}</p>
        <p className="text-xl">
          {(form.watch("quantity") || 1) * product.price!} zł
        </p>
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="my-6">
              <FormLabel>{t("quantity")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-48"
                  placeholder="Please choose amount"
                  min={1}
                  max={100}
                  onKeyDown={(
                    // INFO: Prevents the enter key from submitting the form (why isn't this an option in react-hook-form???)
                    e: React.KeyboardEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  {...field}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          {t2("addToCart")}
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
