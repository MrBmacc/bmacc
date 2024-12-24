import { useReadContract } from "wagmi";

import { cryptoTippingAbi } from "@/config/abi/cryptoTippingAbi";
import { currencies, cryptoTippingAddress } from "@/config/constants";

import type { Address } from "viem";

export function useUserTipsReceived(userAddress: Address) {
  const cryptoTippingContract = {
    abi: cryptoTippingAbi,
    address: cryptoTippingAddress,
  };

  const ethCurrency = currencies.find((c) => c.symbol === "ETH");
  const usdcCurrency = currencies.find((c) => c.symbol === "USDC");
  const bmaccCurrency = currencies.find((c) => c.symbol === "BMACC");

  const {
    data: usdcTips,
    isPending: isUsdcPending,
    error: usdcError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, usdcCurrency?.address as Address],
  });

  const {
    data: ethTips,
    isPending: isEthPending,
    error: ethError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, ethCurrency?.address as Address],
  });

  const {
    data: bmaccTips,
    isPending: isbmaccPending,
    error: bmaccError,
  } = useReadContract({
    ...cryptoTippingContract,
    functionName: "tipsReceived",
    args: [userAddress, bmaccCurrency?.address as Address],
  });

  return {
    tips: {
      USDC: {
        amount: usdcTips,
        formatted: usdcTips
          ? Number(usdcTips) / 10 ** (usdcCurrency?.decimals || 6)
          : 0,
      },
      ETH: {
        amount: ethTips,
        formatted: ethTips
          ? Number(ethTips) / 10 ** (ethCurrency?.decimals || 18)
          : 0,
      },
      BMACC: {
        amount: bmaccTips,
        formatted: bmaccTips
          ? Number(bmaccTips) / 10 ** (bmaccCurrency?.decimals || 18)
          : 0,
      },
    },
    isHistoryError: usdcError || ethError || bmaccError,
    isHistoryLoading: isUsdcPending || isEthPending || isbmaccPending,
  };
}
