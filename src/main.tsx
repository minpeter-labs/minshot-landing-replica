import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { App } from "./app";

const enableReactDevTools =
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_REACT_DEVTOOLS !== "1";

if (enableReactDevTools) {
  import("react-grab").catch((error: unknown) => {
    console.error("Failed to load react-grab", error);
  });
  import("react-scan").catch((error: unknown) => {
    console.error("Failed to load react-scan", error);
  });
}

const rootElement = document.getElementById("root");

if (!(rootElement instanceof HTMLElement)) {
  throw new Error("React root element was not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
