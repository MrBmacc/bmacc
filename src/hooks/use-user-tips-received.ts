import { useReadContract } from "wagmi";

import { cryptoTippingAbi } from "@/config/abi/cryptoTippingAbi";
import { currencies, cryptoTippingAddress } from "@/config/constants";

import type { Address } from "viem";

export function useUserTipsReceived(userAddress: Address) {
  const cryptoTippingContract = {
    abi: cryptoTippingAbi,
    address: cryptoTippingAddress,
  };

  const {
    data: usdcTips,
    isPending: isUsdcPending,
    error: usdcError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, currencies[0].address],
  });

  const {
    data: usdtTips,
    isPending: isUsdtPending,
    error: usdtError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, currencies[1].address],
  });

  return {
    tips: {
      USDC: {
        amount: usdcTips,
        formatted: usdcTips
          ? Number(usdcTips) / 10 ** currencies[0].decimals
          : 0,
      },
      USDT: {
        amount: usdtTips,
        formatted: usdtTips
          ? Number(usdtTips) / 10 ** currencies[1].decimals
          : 0,
      },
    },
    isHistoryError: usdcError || usdtError,
    isHistoryLoading: isUsdcPending || isUsdtPending,
  };
}
