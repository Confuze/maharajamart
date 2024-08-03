// A script that turns JSON exported from a google docs spreadsheet into usable objects for the products.ts file
interface ISheetProduct {
  products: string;
  oldPricePln?: number | string;
  buyPrice?: number | string;
  newPrice?: number | string;
  picture?: string;
}

import { Product, Products } from "./products";
import fs from "fs";
import _ from "lodash";

import sheetProductsNoType from "./sheetProducts.json";
const sheetProducts: ISheetProduct[] = sheetProductsNoType; // suprisingly this appears to be the cleanest way to cast a type onto a json file
let newProducts: Products = {};
let currentCategory = "cosmetics";

for (const sheetProduct of sheetProducts) {
  const name = _.camelCase(_.deburr(sheetProduct.products));

  if (typeof sheetProduct.buyPrice === "string") {
    // If buyPrice is a string, it means it's a category row
    newProducts[name] = {
      displayName: {
        en: sheetProduct.products,
        pl: sheetProduct.products,
      },
      products: {},
    };
    currentCategory = name;
  } else if (typeof sheetProduct.oldPricePln === "number") {
    let newProduct: Product = {
      displayName: sheetProduct.products,
      price: sheetProduct.oldPricePln,
      picture: sheetProduct.picture,
    };
    newProducts[currentCategory].products[name] = newProduct;
  }
}

fs.writeFileSync(
  "src/data/generatedProducts.json",
  JSON.stringify(newProducts, null, 2),
  "utf-8",
);
