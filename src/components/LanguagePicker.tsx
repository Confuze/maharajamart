// WARN: This may not be the optimal approach here
// Could this have been done with a <Link> and usePathname()? yes.
// Does this need to import 4 different react functions? probably not.
// Why do it this way? I wanted to make it into an actual select button, sacrificing simpilicity and (maybe) performance for (slightly) better UX

"use client";

import { usePathname, useRouter } from "@/src/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import { Globe } from "lucide-react";

export default function LanguagePicker({ locale }: { locale: any }) {
  // INFO: I don't care it's any, I'm not gonna spend an hour setting the right type for this with the state and everything for a variable that I'm gonna use 3 times
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const languages: any = { en: "English", pl: "Polski" }; // INFO: Same as same as line 13
  const pathname = usePathname();
  const router = useRouter();

  // WARN: I don't know if disabling the eslint rule is the right way to do things here but router and pathname can't be in the dependencies and I don't have any other solution
  useEffect(() => {
    router.replace(pathname, { locale: selectedLocale });
  }, [selectedLocale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Select value={selectedLocale} onValueChange={setSelectedLocale}>
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
