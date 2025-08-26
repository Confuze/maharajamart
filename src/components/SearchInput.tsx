"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Link, useRouter } from "../i18n/navigation";
import { FormEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getSuggestions } from "../lib/getSuggestions";
import { Suggestion } from "minisearch";

function SearchInput({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  let searched = "";

  if ((pathname.endsWith("search") || pathname.endsWith("search/")) && q)
    searched = q;

  const t = useTranslations("Search");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOpen(false);

    const query = inputRef.current!.value;
    router.push({ pathname: "/products/search/", query: { q: query } });
  };

  const onChange = async () => {
    const inputQ = inputRef.current?.value || q || "";
    console.log(q);
    if (inputQ.length < 3 || inputQ.length > 36) return;
    const fetchedSuggestions = await getSuggestions(inputQ);

    setSuggestions(fetchedSuggestions);
  };

  const onChangeDebounced = useDebouncedCallback(onChange);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) onChange();
        else setSuggestions([]);
      }}
    >
      <DialogTrigger asChild>
        {!mobile ? (
          <button className="flex h-10 w-40 max-w-full shrink text-sm rounded-md border border-neutral-200 bg-white py-2 px-3 items-center gap-4 ring-offset-white no-increment text-center hover:bg-gray-100 transition">
            <Search size={16} />
            <p className={q ? "" : "text-gray-500"}>
              {searched || t("search")}
            </p>
          </button>
        ) : (
          <button aria-label={t("search")}>
            <Search size={20} className="mr-1" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 top-[30%] bg-background shadow-2xl border-none p-0 h-2/5 overflow-y-hidden">
        <DialogHeader className=" border-b border-primary shadow-none! focus:shadow-none! w-full py-2 px-3">
          <DialogTitle className="sr-only">{t("search")}</DialogTitle>
          <form
            className="flex flex-row gap-2 w-full items-center"
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <Label className="sr-only" htmlFor="q">
              {t("search")}
            </Label>
            <Search size={20} className="opacity-60" />
            <input
              ref={inputRef}
              id="q"
              autoSave="off"
              autoComplete="off"
              onChange={onChangeDebounced}
              type="text"
              name="q"
              minLength={3}
              placeholder={t("search")}
              className="outline-none focus:outline-none w-full text-lg px-1 border-transparent placeholder:text-neutral-500 bg-transparent"
              maxLength={36}
              defaultValue={q || undefined}
            ></input>
            <DialogClose className="min-h-full text-primary static" asChild>
              <button className="opacity-60 hover:opacity-100 transition">
                <X size={20} />
              </button>
            </DialogClose>
          </form>
        </DialogHeader>
        <DialogDescription className="py-3 px-6 overflow-y-scroll h-auto">
          {suggestions.map((suggestion, key) => (
            <Link
              href={`/products/search/?q=${suggestion.suggestion}`}
              key={key}
              className="p-3 rounded-md hover:bg-black/5 block"
              onClick={() => {
                setOpen(false);
                setSuggestions([]);
              }}
            >
              {suggestion.suggestion}
            </Link>
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default SearchInput;
