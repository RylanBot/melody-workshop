import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "tdesign-react/es/style/index.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import "@/styles/theme.css";
import "@/styles/index.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
