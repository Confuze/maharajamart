import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3})$/),
  address: z.string(),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/),
  town: z.string(),
  extraInfo: z.string().optional(),
});
