// WARN: This may not be the optimal approach here
// Could this have been done with a <Link> and usePathname()? yes.
// Does this need to import 4 different react functions? probably not.
// Why do it this way? I wanted to make it into an actual select button, sacrificing simpilicity and (maybe) performance for (slightly) better UX

"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import { Globe } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { localeType } from "../i18n/routing";

export default function LanguagePicker() {
  const locale = useLocale() as localeType;
  const languages = { en: "English", pl: "Polski" }; // INFO: Same as same as line 13
  const [selectedLocale, setSelectedLocale] = useState<"en" | "pl">(locale);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const query = Object.fromEntries(useSearchParams().entries());

  const changeLocale = (newLocale: localeType) => {
    setSelectedLocale(newLocale);
    // @ts-expect-error -- TypeScript will validate that only known `params`
    // are used in combination with a given `pathname`. Since the two will
    // always match for the current route, we can skip runtime checks.
    router.replace({ pathname, params, query }, { locale: newLocale });
  };

  return (
    <Select
      value={selectedLocale}
      onValueChange={(value: "en" | "pl") => changeLocale(value)}
    >
      <SelectTrigger>
        <SelectIcon>
          <Globe className="h-5 mr-1" />
        </SelectIcon>
        <SelectValue className="hover:underline" aria-label={selectedLocale}>
          {languages[selectedLocale]}
        </SelectValue>
      </SelectTrigger>

      <SelectContent position="item-aligned">
        <SelectItem value="en">{languages.en}</SelectItem>
        <SelectItem value="pl">{languages.pl}</SelectItem>
      </SelectContent>
    </Select>
  );
}
