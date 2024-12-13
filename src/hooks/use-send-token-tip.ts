import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { cryptoTippingAbi } from "@/config/abi/cryptoTippingAbi";

import { cryptoTippingAddress } from "@/config/constants";

import { useToast } from "@/hooks/use-toast";
import type { Address } from "viem";

// Hook to send token tips
export function useSendTokenTip() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { toast } = useToast();

  const [hasSentTip, setHasSentTip] = useState(false);
  const [isSendingTip, setIsSendingTip] = useState(false);

  const sendTip = async (
    tokenAddress: Address,
    recipient: Address,
    amount: bigint
  ) => {
    setIsSendingTip(true);
    try {
      const tx = await writeContractAsync({
        abi: cryptoTippingAbi,
        address: cryptoTippingAddress,
        functionName: "sendTokenTip",
        args: [tokenAddress, recipient, amount],
      });
      return tx;
    } catch (err) {
      console.error("Error sending token tip:", err);
      throw err;
    } finally {
      setHasSentTip(true);
      setIsSendingTip(false);
    }
  };

  // Notifications
  useEffect(() => {
    if (isPending) {
      toast({
        title: "Pending",
      });
    }

    if (isSendingTip) {
      toast({
        title: "Sending tip",
      });
    }

    if (hasSentTip) {
      toast({
        title: "Tip sent",
      });
    }
  }, [error, hasSentTip, isPending, isSendingTip, toast]);

  return { sendTip, isPending, error };
}
