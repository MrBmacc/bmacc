import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProviderAppKit } from "@/components/AppKitProvider";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderAppKit>
      <App />
    </ProviderAppKit>
  </StrictMode>
);
