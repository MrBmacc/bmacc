import { useAppKit } from "@reown/appkit/react";
import { useAccount, useSwitchChain } from "wagmi";
import { useState, useCallback, useEffect } from "react";

type UseConnectionCheckReturn = {
  executeWithConnectionCheck: (fn: () => void) => Promise<void>;
  isConnecting: boolean;
};

export const useConnectionCheck = ({
  desiredChainId,
}: { desiredChainId?: number } = {}): UseConnectionCheckReturn => {
  const { open } = useAppKit();

  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
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
        if (desiredChainId && chainId !== desiredChainId) {
          try {
            await switchChainAsync?.({ chainId: desiredChainId });
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
    [isConnected, desiredChainId, chainId, switchChainAsync, open]
  );

  return { executeWithConnectionCheck, isConnecting };
};
