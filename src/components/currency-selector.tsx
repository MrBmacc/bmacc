import { useUserBalance } from "@/hooks/use-user-balance";

import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Currency } from "@/config/constants";

export interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

const CurrencySelector = ({
  currencies,
  selectedCurrency,
  setSelectedCurrency,
}: CurrencySelectorProps) => {
  const { hasNative, hasUsdc, hasBmacc } = useUserBalance();

  const getIsDisabled = (symbol: string) => {
    switch (symbol) {
      case "ETH":
        return !hasNative;
      case "USDC":
        return !hasUsdc;
      case "BMACC":
        return !hasBmacc;
      default:
        return false;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Currency
      </label>
      <div className="grid grid-cols-3 gap-2">
        <TooltipProvider>
          {currencies.map((currency: Currency) => {
            const isDisabled = getIsDisabled(currency.symbol);

            return (
              <Tooltip key={currency.symbol}>
                <TooltipTrigger asChild>
                  <div>
                    <button
                      onClick={() =>
                        !isDisabled && setSelectedCurrency(currency)
                      }
                      disabled={isDisabled}
                      className={`p-2 w-full rounded-lg border-2 transition-all flex items-center gap-2 text-sm sm:text-base ${
                        isDisabled
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                          : selectedCurrency.symbol === currency.symbol
                            ? "border-teal-300 bg-teal-50"
                            : "border-gray-200 hover:border-teal-400"
                      }`}
                    >
                      <img
                        src={currency.image}
                        alt={currency.symbol}
                        className="sm:w-6 sm:h-6 w-4 h-4"
                      />
                      {currency.symbol}
                    </button>
                  </div>
                </TooltipTrigger>
                {isDisabled && (
                  <TooltipContent>
                    <p>You don't have any {currency.symbol}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CurrencySelector;
