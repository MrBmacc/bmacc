import { useState, useCallback, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi";

type UseConnectionCheckReturn = {
  executeWithConnectionCheck: (fn: () => void) => Promise<void>;
  isConnecting: boolean;
};

export const useConnectionCheck = ({
  desiredChainId,
}: { desiredChainId?: number } = {}): UseConnectionCheckReturn => {
  const { chain } = useNetwork();
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingFunction, setPendingFunction] = useState<(() => void) | null>(
    null
  );

  // Watch for connection state changes
  useEffect(() => {
    if (isConnected && pendingFunction) {
      pendingFunction();
      setPendingFunction(null);
      setIsConnecting(false);
    }
  }, [isConnected, pendingFunction]);

  const executeWithConnectionCheck = useCallback(
    async (fn: () => void) => {
      if (isConnected) {
        if (desiredChainId && chain?.id !== desiredChainId) {
          try {
            await switchNetworkAsync?.(desiredChainId);
          } catch (error) {
            console.error("Failed to switch network:", error);
            return;
          }
        }
        fn();
        return;
      }

      setIsConnecting(true);
      setPendingFunction(() => fn);
      try {
        await open();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setIsConnecting(false);
        setPendingFunction(null);
      }
    },
    [isConnected, desiredChainId, chain?.id, switchNetworkAsync, open]
  );

  return { executeWithConnectionCheck, isConnecting };
};
