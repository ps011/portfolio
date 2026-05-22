import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@prasheel/ui";

export const LanguageSwitcher = () => {
  const { locales, locale: currentLocale, asPath } = useRouter();

  if (!locales || locales.length <= 1) return null;

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLocale ? "default" : "neutral"}
          size="sm"
          asChild
        >
          <Link
            href={asPath}
            locale={locale}
            aria-current={locale === currentLocale ? "true" : undefined}
            className="no-underline"
          >
            {locale.toUpperCase()}
          </Link>
        </Button>
      ))}
    </div>
  );
};
