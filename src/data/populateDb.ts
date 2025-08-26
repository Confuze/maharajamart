import readline from "readline";
import { productData } from "./products";
import prisma from "../lib/prisma";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  "WARNING\nThis script will introduce permament changes to the database",
);

function confirmation() {
  return new Promise((resolve) => {
    rl.question("Are you sure you want to continue? [y/N]\n", (input) => {
      const confirmed = input.toLowerCase() == "y";
      if (!confirmed) process.exit();
      resolve(true);
      rl.close();
    });
  });
}

console.log(process.argv);
if (process.argv[2] != "--noconfirm") await confirmation();

const categoryKeys = Object.keys(productData);

console.log(`Found ${categoryKeys.length} categories`);
categoryKeys.forEach(async (categoryKey, index) => {
  const category = productData[categoryKey];
  console.log(
    `--- Updating category ${index}/${categoryKeys.length} (${category.displayName}) ---`,
  );
  const result = await prisma.category.upsert({
    where: {
      name: category.displayName.en,
    },
    update: {
      name: category.displayName.en,
      namePl: category.displayName.pl,
      slug: categoryKey,
    },
    create: {
      name: category.displayName.en,
      namePl: category.displayName.pl,
      slug: categoryKey,
    },
  });

  const productKeys = Object.keys(category.products);
  console.log(`Found ${productKeys.length} products in category`);
  productKeys.forEach(async (productKey, index) => {
    const product = category.products[productKey];
    console.log(
      `Updating product ${index + 1}/${productKeys.length} (${product.displayName})`,
    );

    if (!product.price) return;

    let res;
    // A lot of URLs provided in the spreadsheet are unavailible so this make sure the ersource actually exists
    if (product.picture) res = await fetch(product.picture);
    if (res?.status === 404) product.picture = undefined;

    await prisma.product.upsert({
      where: {
        name: product.displayName,
      },
      update: {
        name: product.displayName,
        slug: productKey,
        price: product.price,
        description: product.description,
        categoryId: result.id,
        imageUrl: product.picture,
      },
      create: {
        name: product.displayName,
        slug: productKey,
        price: product.price,
        description: product.description,
        categoryId: result.id,
        imageUrl: product.picture,
      },
    });
    console.log(
      `Product ${index + 1}/${productKeys.length} (${product.displayName}) updated`,
    );
  });
  console.log(
    `--- Category ${index + 1}/${categoryKeys.length} (${category.displayName}) updated ---`,
  );
});
