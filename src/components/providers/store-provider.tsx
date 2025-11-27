"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Provider } from "react-redux";
import type { AppStore } from "@/lib/store";
import { makeStore } from "@/lib/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo<AppStore>(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
