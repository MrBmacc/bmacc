import { useAccount, useBalance, useReadContracts } from "wagmi";
import { base } from "wagmi/chains";
import { erc20Abi, formatUnits } from "viem";
import { useMemo, useEffect } from "react";

import useStore from "@/stores/app.store";
import { bmaccAddress, usdcAddress } from "@/config/constants";

type TokenBalance = {
  balance: bigint;
  decimals: number;
  symbol: string;
  formatted: string;
};

type UserBalances = {
  nativeBalance: {
    data?: {
      value: bigint;
      decimals: number;
      symbol: string;
      formatted: string;
    };
    isError: boolean;
    isLoading: boolean;
  };
  usdcBalance: TokenBalance | null;
  bmaccBalance: TokenBalance | null;
  hasNative: boolean;
  hasUsdc: boolean;
  hasBmacc: boolean;
  isLoading: boolean;
  isError: boolean;
};

export const useUserBalance = (): UserBalances => {
  const { address } = useAccount();

  // Native balance query
  const nativeBalance = useBalance({
    address,
    chainId: base.id,
  });

  // Common contract configs for both tokens
  const getTokenConfig = (tokenAddress: string) =>
    [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ] as const;

  // Token balance queries
  const bmaccResult = useReadContracts({
    allowFailure: false,
    contracts: getTokenConfig(bmaccAddress),
  });

  const usdcResult = useReadContracts({
    allowFailure: false,
    contracts: getTokenConfig(usdcAddress),
  });

  // Format token balances using memoization
  const formatTokenBalance = (result: any): TokenBalance | null => {
    if (!result?.data || result.isError) return null;

    const [balance, decimals, symbol] = result.data;
    return {
      balance,
      decimals,
      symbol,
      formatted: formatUnits(balance, decimals),
    };
  };

  const formattedBalances = useMemo(
    () => ({
      usdcBalance: formatTokenBalance(usdcResult),
      bmaccBalance: formatTokenBalance(bmaccResult),
    }),
    [usdcResult, bmaccResult]
  );

  // If not enough eth for gas, set hasEthForGas to false
  const { setHasEthForGas } = useStore();
  useEffect(() => {
    if (nativeBalance.data?.value && nativeBalance.data.value < 1n) {
      setHasEthForGas(false);
    } else {
      setHasEthForGas(true);
    }
  }, [nativeBalance.data?.value, setHasEthForGas]);

  // Calculate has-token flags
  const hasNative = Boolean(
    nativeBalance.data?.value && nativeBalance.data.value > 0n
  );
  const hasUsdc = Boolean(
    formattedBalances.usdcBalance?.balance &&
      formattedBalances.usdcBalance.balance > 0n
  );
  const hasBmacc = Boolean(
    formattedBalances.bmaccBalance?.balance &&
      formattedBalances.bmaccBalance.balance > 0n
  );

  return {
    nativeBalance,
    ...formattedBalances,
    hasNative,
    hasUsdc,
    hasBmacc,
    isLoading:
      nativeBalance.isLoading || bmaccResult.isLoading || usdcResult.isLoading,
    isError: nativeBalance.isError || bmaccResult.isError || usdcResult.isError,
  };
};
