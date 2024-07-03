import { unstable_setRequestLocale } from "next-intl/server";

export default function Category({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <>Category</>;
}
