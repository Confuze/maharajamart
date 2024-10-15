import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3})$/),
  address: z.string().min(1),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/),
  town: z.string().min(1),
  extraInfo: z.string().optional(),
});
