import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().regex(/^(\+\d{1,3}\d{6,10}|[0-9]{9})$/),
  company: z.string().optional(),
  address: z.string().min(1),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/),
  town: z.string().min(1),
  extraInfo: z.string().optional(),
  shippingMethod: z.enum([
    "CLOSE_DELIVERY",
    "COURIER",
    "PARCEL_MACHINE",
    "PICKUP_AT_STORE",
  ]),
});

export const updateSchema = z.object({
  name: z.string().max(48),
  namePl: z.string().max(48).optional(),
  price: z.coerce.number().multipleOf(0.01),
  description: z.string().max(1000).optional(),
  descriptionPl: z.string().max(1000).optional(),
  image: z
    .file()
    .max(10_000_00) // 10 MB
    .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"])
    .optional()
    .or(z.null()),
  imageUrl: z.url().optional().or(z.literal("")),
});
