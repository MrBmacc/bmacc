import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProviderAppKit } from "@/components/provider-appkit";
import { ProviderMoralis } from "@/components/provider-moralis";

import { Toaster } from "@/components/ui/toaster";

import App from "@/App";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderAppKit>
      <ProviderMoralis>
        <App />
        <Toaster />
      </ProviderMoralis>
    </ProviderAppKit>
  </StrictMode>
);
