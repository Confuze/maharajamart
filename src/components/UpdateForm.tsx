"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { updateSchema } from "../lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardInfo } from "../lib/prismaTypes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { updateProduct } from "../lib/updateProduct";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateForm({ product }: { product: CardInfo }) {
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: product.name,
      namePl: product.namePl || "",
      price: product.price,
      description: product.description || "",
      descriptionPl: product.descriptionPl || "",
      imageUrl: product.imageUrl || "",
    },
  });

  const router = useRouter();
  const [showFileInput, setShowFileInput] = useState(!product.imageStoredInFs);

  async function onSubmit(values: z.infer<typeof updateSchema>) {
    if (values.image) setShowFileInput(false);

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
      await updateProduct({ values, id: product.id });

      promiseResolve!();

      router.refresh();
      form.reset(values);
    } catch (error: unknown) {
      promiseReject!();
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-full gap-6 mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="namePl"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>
                    Polish name{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </FormLabel>

                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => {
            return (
              <FormItem className="w-full mb-4">
                <FormLabel>
                  Price{" "}
                  <span className="text-neutral-500">(in polish złoty)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    className="no-increment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem className="w-full mb-4">
                <FormLabel>
                  Description{" "}
                  <span className="text-neutral-500">(optional)</span>
                </FormLabel>

                <FormControl>
                  <Textarea className="h-32" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="descriptionPl"
          render={({ field }) => {
            return (
              <FormItem className="w-full mb-4">
                <FormLabel>
                  Polish description{" "}
                  <span className="text-neutral-500">(optional)</span>
                </FormLabel>

                <FormControl>
                  <Textarea className="h-32" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex w-full gap-6 mb-4">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>
                    External image url{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <p className="text-neutral-500 mt-4 self-center">or</p>
          {showFileInput ? (
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>
                      Image to upload{" "}
                      <span className="text-neutral-500">(optional)</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple={false}
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.files ? e.target.files[0] : null,
                          );
                        }}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ) : (
            <div className="w-full">
              <p className="text-sm leading-none inline">
                Image is already uploaded
              </p>
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  setShowFileInput(true);
                  form.setValue("image", null);
                }}
                variant="outline"
              >
                Remove image
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outline"
            disabled={
              !(
                (showFileInput && product.imageStoredInFs) ||
                (!showFileInput && !product.imageStoredInFs)
              ) && !form.formState.isDirty
            }
          >
            Edit product
          </Button>
        </div>
      </form>
    </Form>
  );
}
