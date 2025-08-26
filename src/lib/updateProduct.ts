"use server";

import { auth } from "@/auth";
import prisma from "./prisma";
import z from "zod";
import { updateSchema } from "./zodSchemas";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import _ from "lodash";

interface FormData {
  values: z.infer<typeof updateSchema>;
  id: string;
}

export async function updateProduct({ values, id }: FormData) {
  const session = auth();

  if (!session) {
    throw new Error("Authentication required");
  }

  let filePath = undefined;

  if (values.image) {
    const buffer = Buffer.from(await values.image.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

    filePath = path.join(process.cwd(), "/public/uploads", id + ".webp");

    fs.writeFileSync(filePath, webpBuffer);
  }

  console.log("test: ", values.image, !!values.image);

  const newSlug = _.camelCase(_.deburr(values.name));

  const { name, namePl, price, description, descriptionPl } = values;

  try {
    await prisma.product.update({
      where: { id: id },
      data: {
        name,
        namePl,
        price,
        description,
        descriptionPl,
        slug: newSlug,
        imageStoredInFs: !!values.image,
        imageUrl: values.imageUrl,
      },
      include: { category: true },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        status: "500 Interval server error",
        message:
          "Updating database entry failed. Most likely because an object with the given ID does not exist\nError message:\n" +
          error,
      },
      { status: 500 },
    );
  }

  revalidatePath(`/[locale]/(global)/products/[category]`, "page");
  revalidatePath(`/[locale]/(global)/products/all/[page]`, "page");
  revalidatePath(`/[locale]/(global)/products/[category]/[slug]`, "page");

  return "Succesfully updated database entry";
}
