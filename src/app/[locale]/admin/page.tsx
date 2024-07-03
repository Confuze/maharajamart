import { unstable_setRequestLocale } from "next-intl/server";

// admin page with some (TODO: figure out what kind) authentification
export default function Admin({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <>Admin</>;
}
