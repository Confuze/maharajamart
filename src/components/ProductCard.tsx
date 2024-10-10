import Image from "next/image";
import { Product, products } from "../data/products";
import { useTranslations } from "next-intl";
import placeholder from "@/public/picturePlaceholder.png";
import { Link } from "../navigation";
import AddToCartButton from "./AddToCartButton";

interface ProductInfo extends Product {
  category: string;
  slug: string;
  link?: never;
}

interface PromotionInfo extends Product {
  link: string;
  category?: never;
  slug?: never;
  price?: never;
}

export type CardInfo = ProductInfo | PromotionInfo;

function ProductCard({
  product,
  locale,
}: {
  product: CardInfo;
  locale: "en" | "pl";
}) {
  const t = useTranslations("Layout.products");

  return (
    <Link
      href={product.link || `/products/${product.category}/${product.slug}`}
      className="w-full h-full "
    >
      <div className="flex flex-col bg-background2 w-full h-full p-2 lg:p-6 rounded-xl duration-150 hover:shadow-[0_0_.75rem_0rem_rgba(0,0,0,0.2)] hover:scale-[97.5%]">
        <div className="bg-white lg:border-4 lg:border-secondary overflow-hidden rounded-lg lg:rounded-3xl relative w-full aspect-square">
          <Image
            className="text-[0] bg-cover"
            style={{ backgroundImage: `url(${placeholder.src})` }}
            placeholder={`data:image/${placeholder}`}
            quality={75}
            fill
            src={product.picture || ""}
            alt={product.displayName}
          />
        </div>
        <p className="font-serif text-lg leading-none mt-2 text-secondary">
          {product.category
            ? products[product.category].displayName[locale]
            : t("promotion")}
        </p>
        <h1 className="text-xl mb-2">{product.displayName}</h1>
        <div className="flex grow items-end justify-between">
          {product.price && <p>{product.price} zł</p>}
          <AddToCartButton product={product} />
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
