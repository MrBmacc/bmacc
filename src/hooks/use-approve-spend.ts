import { useCallback, useEffect, useState } from "react";
import { erc20Abi, parseUnits } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { useToast } from "@/hooks/use-toast";

import type { Address } from "viem";
import { cryptoTippingAddress } from "@/config/constants";

export const useApproveSpend = ({
  address,
  totalAmount,
  decimals,
}: {
  address: Address;
  totalAmount: string;
  decimals: number;
}) => {
  const { toast } = useToast();
  const { connector } = useAccount();
  const [retryCount, setRetryCount] = useState(0);

  const {
    data: hash,
    isPending,
    writeContractAsync,
    error: approvalError,
    isError: isApprovalError,
    reset: resetWriteContract,
    status,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproved } =
    useWaitForTransactionReceipt({
      hash,
      timeout: 30_000,
    });

  // Reset function with retry tracking
  const resetStates = useCallback(() => {
    resetWriteContract();
    setRetryCount(0);
  }, [resetWriteContract]);

  const triggerApprove = useCallback(async (): Promise<string> => {
    try {
      // Only reset if we're not retrying
      if (retryCount === 0) {
        resetStates();
      }

      if (!totalAmount) throw new Error("Total amount is required");
      if (!decimals) throw new Error("Decimals are required");

      // Check if we're using Coinbase Wallet
      const isCoinbaseWallet = connector?.name === "Coinbase Wallet";
      console.log("Wallet type:", connector?.name);

      const tokenContract = {
        abi: erc20Abi,
        address: address,
      };

      const increasedAmount = Math.ceil(Number(totalAmount) * 1.05);
      const amountInWei = parseUnits(increasedAmount.toString(), decimals);

      const txHash = await writeContractAsync({
        ...tokenContract,
        functionName: "approve",
        args: [cryptoTippingAddress, amountInWei],
        // Add some gas settings specifically for Coinbase Wallet
        ...(isCoinbaseWallet && {
          gas: undefined, // Let Coinbase estimate
          gasPrice: undefined, // Let Coinbase handle it
        }),
      });

      // For Coinbase Wallet, add a small delay before returning
      if (isCoinbaseWallet) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return txHash;
    } catch (error) {
      console.error("Approval error:", { error, status, retryCount });

      // Handle Coinbase specific errors
      if (connector?.name === "Coinbase Wallet") {
        // If we haven't retried too many times and it seems like a wallet interaction issue
        if (
          retryCount < 2 &&
          (error.message?.includes("User rejected") ||
            error.message?.includes("User denied") ||
            error.message?.includes("User cancelled"))
        ) {
          setRetryCount((prev) => prev + 1);
          console.log("Retrying Coinbase approval...");
          return triggerApprove();
        }
      }

      resetStates();
      throw error;
    }
  }, [
    address,
    decimals,
    totalAmount,
    writeContractAsync,
    resetStates,
    retryCount,
    connector?.name,
    status,
  ]);

  // Enhanced feedback for Coinbase Wallet
  useEffect(() => {
    const isCoinbaseWallet = connector?.name === "Coinbase Wallet";

    if (isPending) {
      toast({
        title: "Confirm in Wallet",
        description: isCoinbaseWallet
          ? "Please approve both confirmation windows in Coinbase Wallet"
          : "Please check your wallet to approve",
        duration: 8000,
      });
    }

    if (isApproving) {
      toast({
        title: "Processing Approval",
        description: isCoinbaseWallet
          ? "Coinbase Wallet is processing your transaction"
          : "Transaction is being processed",
        duration: 10000,
      });
    }

    if (isApproved) {
      toast({
        title: "Approval Successful",
        description: "You can now proceed",
      });
      resetStates();
    }

    if (isApprovalError) {
      let errorMessage = "Please try again";

      if (approvalError?.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled";
      } else if (approvalError?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      }

      toast({
        title: "Approval Failed",
        description: errorMessage,
        duration: 6000,
      });

      resetStates();
    }
  }, [
    isPending,
    isApproving,
    isApproved,
    isApprovalError,
    approvalError,
    toast,
    resetStates,
    connector?.name,
  ]);

  return {
    hash,
    isPending,
    isApproved,
    isApproving,
    triggerApprove,
    approvalError,
    isApprovalError,
  };
};
