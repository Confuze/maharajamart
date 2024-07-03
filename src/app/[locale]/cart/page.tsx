import { unstable_setRequestLocale } from "next-intl/server";

export default function Cart({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <>Cart</>;
}
