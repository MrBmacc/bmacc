import type { Address } from "viem";

export const bmaccAddress: Address =
  "0x1D9546f458542d03a86B11bF94B490a707794218";

export const cryptoTippingAddress: Address =
  "0x89A6596016C136C3b52Be584249e6359E1fdD637";

export const tipAmounts = [
  { amount: "5", label: "Small Coffee" },
  { amount: "10", label: "Large Coffee" },
  { amount: "20", label: "Coffee + Snack" },
];

export type Currency = {
  symbol: string;
  address: Address;
  decimals: number;
};

export const currencies: Currency[] = [
  { symbol: "BMACC", address: bmaccAddress, decimals: 18 },
  {
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    symbol: "USDT",
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    decimals: 6,
  },
];
