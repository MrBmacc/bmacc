import { useReadContract } from "wagmi";

import { cryptoTippingAbi } from "@/config/abi/cryptoTippingAbi";
import { currencies, cryptoTippingAddress } from "@/config/constants";

import type { Address } from "viem";

export function useUserTipsReceived(userAddress: Address) {
  const cryptoTippingContract = {
    abi: cryptoTippingAbi,
    address: cryptoTippingAddress,
  };

  const usdcCurrency = currencies.find((c) => c.symbol === "USDC");
  const usdtCurrency = currencies.find((c) => c.symbol === "USDT");
  const bmaccCurrency = currencies.find((c) => c.symbol === "BMACC");

  const {
    data: usdcTips,
    isPending: isUsdcPending,
    error: usdcError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, usdcCurrency?.address],
  });

  const {
    data: usdtTips,
    isPending: isUsdtPending,
    error: usdtError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, usdtCurrency?.address],
  });

  const {
    data: bmaccTips,
    isPending: isbmaccPending,
    error: bmaccError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, bmaccCurrency?.address],
  });

  return {
    tips: {
      USDC: {
        amount: usdcTips,
        formatted: usdcTips
          ? Number(usdcTips) / 10 ** usdcCurrency?.decimals
          : 0,
      },
      USDT: {
        amount: usdtTips,
        formatted: usdtTips
          ? Number(usdtTips) / 10 ** usdtCurrency?.decimals
          : 0,
      },
      BMACC: {
        amount: bmaccTips,
        formatted: bmaccTips
          ? Number(bmaccTips) / 10 ** bmaccCurrency?.decimals
          : 0,
      },
    },
    isHistoryError: usdcError || usdtError || bmaccError,
    isHistoryLoading: isUsdcPending || isUsdtPending || isbmaccPending,
  };
}
