import { Clock, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import Image, { StaticImageData } from "next/image";

function Branch({
  name,
  description,
  image,
  open,
  location,
  locationURL,
  phone,
}: {
  name: string;
  description?: string;
  image?: StaticImageData;
  open: string;
  location: string;
  locationURL: string;
  phone: string;
}) {
  const t = useTranslations("Branches");

  return (
    <div className="p-4 lg:p-8 rounded-lg lg:rounded-xl bg-background2">
      {image && (
        <Image
          src={image}
          alt={name}
          className="rounded max-h-[20vh] lg:max-h-[40vh] object-cover object-top mb-4"
        />
      )}
      <h2 className="font-serif text-secondary text-xl lg:text-3xl">{name}</h2>
      {description && <p>{description}</p>}
      <div className="mt-4 flex flex-col gap-1 *:flex *:items-center *:gap-2">
        <p className="">
          <Clock className="h-4 flex-shrink-0" /> {t("open")}
          {open}
        </p>
        <Link href={locationURL}>
          <MapPin className="h-4 flex-shrink-0" />
          {location}
        </Link>
        <Link href={`tel:+48 ${phone}`}>
          <Phone className="h-4 flex-shrink-0" />
          {phone}
        </Link>
      </div>
    </div>
  );
}

export default Branch;
