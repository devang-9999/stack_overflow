"use client";

import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ThemeRegistry from "./ThemeRegistry";
import AuthInit from "@/redux/authInit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AuthInit />
              {children}
            </PersistGate>
          </Provider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
