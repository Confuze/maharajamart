import MiniSearch from "minisearch";
import prisma from "./prisma";

const products = await prisma.product.findMany({
  where: {
    archived: false,
  },
  select: {
    id: true,
    name: true,
    namePl: true,
    description: true,
    descriptionPl: true,
  },
});

export const miniSearch = new MiniSearch({
  fields: ["name", "description", "namePl", "descriptionPl"],
  storeFields: ["id"],
  searchOptions: { boost: { title: 5, titlePl: 4, description: 2 } },
});

miniSearch.addAll(products);
