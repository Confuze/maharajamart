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

const formSchema = z.object({
  quantity: z.number().min(1).max(50),
});

function ProductForm({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const t2 = useTranslations("Layout.products");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-2 text-secondary font-serif text-4xl">
          {product.displayName}
        </h1>
        <p className="text-xl">
          {(form.getValues("quantity") || 1) * product.price!} zł
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
                  className="w-min"
                  placeholder="1"
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
