import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "ja", "ko", "vi", "fr", "es", "th", "pt", "de", "id"],
  defaultLocale: "zh",
});
