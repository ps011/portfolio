import React from "react";
import messages from "../messages/en.json";

type Messages = Record<string, Record<string, string>>;

export function useTranslations(namespace?: string) {
  return (key: string, values?: Record<string, unknown>) => {
    let text: string;
    if (namespace) {
      text = (messages as Messages)[namespace]?.[key] ?? `${namespace}.${key}`;
    } else {
      text = key;
    }
    if (values) {
      return Object.entries(values).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, String(v)),
        text,
      );
    }
    return text;
  };
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
