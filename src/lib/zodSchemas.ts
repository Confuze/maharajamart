import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
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
