"use server";

import prisma from "./prisma";
import { ICart, ICartContents } from "./storage";

export async function revalidateCart(cart: ICart) {
  const { contents } = cart;

  if (!contents) return { newCart: contents, changed: 0 };

  const ids = Object.keys(contents).map((key) => contents[key].id);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
      archived: false,
    },
    include: { category: true },
  });

  const newCart: ICartContents = {};
  let changed = 0;

  const productMap = new Map(products.map((p) => [p.id, p]));

  Object.keys(contents).forEach((key) => {
    const item = contents[key];
    const product = productMap.get(item.id);
    if (!product) {
      changed++;
      return;
    }

    const equal =
      product.name == item.name &&
      product.namePl == item.namePl &&
      product.slug == item.slug &&
      product.price == item.price &&
      product.imageUrl == item.imageUrl &&
      product.imageStoredInFs == item.imageStoredInFs &&
      product.category.slug == item.category.slug;

    if (equal) {
      newCart[item.id] = contents[key];
    } else {
      changed++;
      newCart[item.id] = { ...product, quantity: item.quantity };
    }
  });

  return { changed, newCart };
}
