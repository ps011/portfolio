import React, { createContext, useContext } from "react";
import type { UIConfig } from "../interfaces/ui-config";
import { DEFAULT_UI_CONFIG } from "./ui-defaults";

const UIConfigContext = createContext<UIConfig>(DEFAULT_UI_CONFIG);

export function UIConfigProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UIConfig;
}) {
  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  );
}

export function useUIConfig(): UIConfig {
  return useContext(UIConfigContext);
}
