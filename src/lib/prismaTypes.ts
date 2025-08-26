import { Prisma } from "@prisma/client";

export type productPayloadDeep = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type CardInfo = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

export type orderPayloadDeep = Prisma.OrderGetPayload<{
  include: { cart: true };
}>;
