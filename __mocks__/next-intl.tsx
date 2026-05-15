import React from "react";
import messages from "../messages/en.json";

type Messages = Record<string, Record<string, string>>;

export function useTranslations(namespace?: string) {
  const resolve = (key: string): string => {
    if (namespace) {
      return (messages as Messages)[namespace]?.[key] ?? `${namespace}.${key}`;
    }
    return key;
  };
  const t = (key: string, values?: Record<string, unknown>) => {
    const text = resolve(key);
    if (values) {
      return Object.entries(values).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, String(v)),
        text,
      );
    }
    return text;
  };
  t.raw = (key: string) => resolve(key);
  return t;
}

export function useLocale() {
  return "en";
}

export function useMessages() {
  return messages;
}

export function NextIntlClientProvider({
  children,
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
}) {
  return <>{children}</>;
}
