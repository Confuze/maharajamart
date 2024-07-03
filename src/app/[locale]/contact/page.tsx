import { unstable_setRequestLocale } from "next-intl/server";

export default function Contact({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <>Contact</>;
}
