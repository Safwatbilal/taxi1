"use client";
import { Provider } from "react-redux";

import { FC, PropsWithChildren } from "react";
import { store } from "@/store/store";

export const Redux: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
