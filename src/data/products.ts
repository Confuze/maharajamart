export interface GeneratedProduct {
  displayName: string;
  price?: number; // Price in PLN
  description?: string;
  picture?: string;
}

export interface GeneratedCategory {
  displayName: {
    en: string;
    pl: string;
  };
  products: { [key: string]: GeneratedProduct } | Record<string, never>;
}

export interface Products {
  [key: string]: GeneratedCategory;
}

import { Category, Product } from "@prisma/client";
import { localeType } from "../i18n/routing";
import generatedProducts from "./generatedProducts.json";
import { ICartItem } from "../lib/storage";

export const productData: Products = generatedProducts;

// INFO: This is by no means clean but there are reasons for it

export function getLocalisedName(
  locale: localeType,
  product: Product | ICartItem,
) {
  return locale == "pl" && product.namePl ? product.namePl : product.name;
}

export function getLocalisedDescription(
  locale: localeType,
  product: Product | ICartItem,
) {
  return locale == "pl" && product.descriptionPl
    ? product.descriptionPl
    : product.description;
}

export function getLocalisedCategory(locale: localeType, category: Category) {
  return locale == "pl" && category.namePl ? category.namePl : category.name;
}
