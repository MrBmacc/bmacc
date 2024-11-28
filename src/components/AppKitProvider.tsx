import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import { WagmiProvider } from "wagmi";

import { mainnet, base } from "@reown/appkit/networks";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "Buy me a crypto coffee | BMACC",
  description:
    "A decentralized way to show appreciation to your favorite creators with cryptocurrency tips on Base",
  url: "https://bmacc.io",
  icons: [""],
};

const networks = [mainnet, base];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: networks,
  defaultNetwork: base,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export function ProviderAppKit({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
