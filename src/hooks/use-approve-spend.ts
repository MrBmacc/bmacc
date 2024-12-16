import { useCallback, useEffect } from "react";
import { erc20Abi, parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

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

  const {
    data: hash,
    isPending,
    writeContractAsync,
    error: approvalError,
    isError: isApprovalError,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproved } =
    useWaitForTransactionReceipt({
      hash,
    });

  const triggerApprove = useCallback(async (): Promise<string> => {
    if (!totalAmount || !decimals || isPending || isApproving || isApproved)
      throw new Error("Invalid state for approval");

    const tokenContract = {
      abi: erc20Abi,
      address: address,
    };

    // Increase amount by 5% and round up
    const increasedAmount = Math.ceil(Number(totalAmount) * 1.05);
    const amountInWei = parseUnits(increasedAmount.toString(), decimals);

    return writeContractAsync({
      ...tokenContract,
      functionName: "approve",
      args: [cryptoTippingAddress, amountInWei],
    });
  }, [
    address,
    decimals,
    isApproved,
    isApproving,
    isPending,
    totalAmount,
    writeContractAsync,
  ]);

  useEffect(() => {
    if (isPending) {
      toast({
        title: "Approval required",
        description: "Approve spending cap in wallet",
      });
    }

    if (isApproving) {
      toast({
        title: "Approving",
      });
    }

    if (isApproved) {
      toast({
        title: "Approval complete",
      });
    }

    if (isApprovalError) {
      toast({
        title: "Approval failed",
        description: approvalError?.shortMessage,
      });
    }
  }, [
    isApproving,
    isApproved,
    isPending,
    isApprovalError,
    approvalError?.shortMessage,
    toast,
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
