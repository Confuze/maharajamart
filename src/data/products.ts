export interface Product {
  displayName: string;
  price?: number; // Price in PLN
  picture?: string;
}

export interface Category {
  displayName: {
    en: string;
    pl: string;
  };
  products: { [key: string]: Product } | Record<string, never>;
}

export interface Products {
  [key: string]: Category;
}

import generatedProducts from "./generatedProducts.json";

export const products: Products = generatedProducts;
