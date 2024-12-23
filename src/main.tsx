import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProviderAppKit } from "@/components/provider-appkit";
import { ProviderMoralis } from "@/components/provider-moralis";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderAppKit>
      <ProviderMoralis>
        <App />
      </ProviderMoralis>
    </ProviderAppKit>
  </StrictMode>
);
