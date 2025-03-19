import MiniSearch from "minisearch";
import { Product, products } from "../data/products";

interface ArrayProduct extends Product {
  slug: string;
  category: string;
  id: number;
}

let id = 0; // hacky, but should work

const productsArray: ArrayProduct[] = [];
const categoryKeys = Object.keys(products);

categoryKeys.forEach((categoryKey) => {
  const catProducts = products[categoryKey].products;

  Object.keys(catProducts).forEach((productKey) => {
    productsArray.push({
      ...catProducts[productKey],
      id: id,
      category: categoryKey,
      slug: productKey,
    });
    id++;
  });
});

export const miniSearch = new MiniSearch({
  fields: ["displayName", "description"],
  storeFields: ["category", "slug"],
  searchOptions: { boost: { title: 4 } },
});

miniSearch.addAll(productsArray);
