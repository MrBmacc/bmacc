import Moralis from "moralis";
import { useQuery } from "@tanstack/react-query";

import { currencies } from "@/config/constants";

import { EvmErc20Price } from "moralis/common-evm-utils";

type TokenPrices = {
  [key: string]: EvmErc20Price;
};

export const useTokenPrices = () => {
  const currencyAddresses = currencies
    .filter((c) => c.address)
    .map((c) => ({ tokenAddress: c.address }));

  const {
    refetch,
    isError,
    isLoading,
    isFetching,
    data: tokenPrices,
  } = useQuery({
    queryKey: ["token_prices"],
    queryFn: async () =>
      await Moralis.EvmApi.token.getMultipleTokenPrices(
        {
          chain: "0x2105", // Base
        },
        {
          tokens: currencyAddresses,
        }
      ),
    refetchOnWindowFocus: false,

    refetchInterval: 10000,
  });

  // Structure for better readability
  const priceDataWithKeys: TokenPrices =
    (tokenPrices?.result &&
      tokenPrices?.result.reduce(
        (acc, token) => ({
          ...acc,
          [(token.tokenSymbol as string) === "WETH"
            ? "ETH"
            : (token.tokenSymbol as string)]: token,
        }),
        {}
      )) ??
    {};

  return {
    refetch,
    isError,
    isLoading,
    isFetching,
    tokenPrices: priceDataWithKeys,
  };
};
