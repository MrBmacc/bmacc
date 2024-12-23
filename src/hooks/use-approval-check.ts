import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import erc20ABI from "@/config/abi/erc20.json";
import { cryptoTippingAddress } from "@/config/constants";
import type { Currency } from "@/config/constants";

import { parseUnits } from "viem";

export const useApprovalCheck = ({
  selectedAmount,
  selectedCurrency,
}: {
  selectedAmount: string;
  selectedCurrency: Currency;
}) => {
  const { address: userAddress } = useAccount();
  const {
    data: currentAllowance,
    error: allowanceError,
    isLoading: allowanceIsLoading,
  } = useReadContract({
    abi: erc20ABI,
    address: selectedCurrency.address,
    functionName: "allowance",
    args: [userAddress, cryptoTippingAddress],
    query: {
      enabled:
        !!userAddress && !!selectedCurrency.address && !!cryptoTippingAddress,
    },
  });

  const needsApproval = useMemo(() => {
    return (
      (currentAllowance as bigint) <
      parseUnits(selectedAmount, selectedCurrency.decimals)
    );
  }, [currentAllowance, selectedAmount, selectedCurrency.decimals]);

  if (selectedCurrency.symbol === "ETH") {
    return {
      needsApproval: false,
      currentAllowance: undefined,
      allowanceError: undefined,
      allowanceIsLoading: false,
    };
  }

  return {
    needsApproval,
    currentAllowance,
    allowanceError,
    allowanceIsLoading,
  };
};
