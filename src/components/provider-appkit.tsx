import { WagmiProvider } from "wagmi";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, base } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "Buy me a crypto coffee | BMACC",
  description:
    "A decentralized way to show appreciation to your favorite creators with cryptocurrency tips on Base",
  url: "https://bmacc.netlify.app",
  icons: ["https://bmacc.netlify.app/images/bmacc-logo.png"],
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
    email: false,
    socials: ["google", "github", "x"],
  },
});

export function ProviderAppKit({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
