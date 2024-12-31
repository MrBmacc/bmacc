import type { Address } from "viem";

export const bmaccAddress: Address =
  "0x1D9546f458542d03a86B11bF94B490a707794218";

export const usdcAddress: Address =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const cryptoTippingAddress: Address =
  "0x89A6596016C136C3b52Be584249e6359E1fdD637";

export const tipAmounts = [
  { amount: "1", label: "Single shot" },
  { amount: "5", label: "Double shot" },
  { amount: "10", label: "Coffee + Snack" },
];

export type Currency = {
  symbol: string;
  address: Address;
  decimals: number;
  image: string;
};

export const currencies: Currency[] = [
  {
    symbol: "BMACC",
    address: bmaccAddress,
    decimals: 18,
    image: "/images/bmacc-logo.png",
  },
  {
    symbol: "USDC",
    address: usdcAddress,
    decimals: 6,
    image: "/images/usdc.png",
  },
  {
    symbol: "ETH",
    address: "0x4200000000000000000000000000000000000006", // weth on base
    decimals: 18,
    image: "/images/eth.png",
  },
];
