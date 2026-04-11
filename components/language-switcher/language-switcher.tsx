import Link from "next/link";
import { useRouter } from "next/router";

export const LanguageSwitcher = () => {
  const { locales, locale: currentLocale, asPath } = useRouter();

  if (!locales || locales.length <= 1) return null;

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={asPath}
          locale={locale}
          aria-current={locale === currentLocale ? "true" : undefined}
          className={`text-sm font-medium transition-colors ${
            locale === currentLocale
              ? "text-foreground underline"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};
