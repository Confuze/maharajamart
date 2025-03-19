"use server";

import { miniSearch } from "@/src/lib/minisearch";

export async function getSuggestions(q: string) {
  if (!q || q == "" || q.length > 36) return [];

  const results = miniSearch.autoSuggest(q, { fuzzy: 0.2 }).slice(0, 6);

  return results;
}
