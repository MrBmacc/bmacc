import { Skeleton } from "@/components/ui/skeleton";
import { useTokenPrices } from "@/hooks/use-token-prices";
import { useUserTipsReceived } from "@/hooks/use-user-tips-received";

import type { Address } from "viem";
import type { Profile } from "@/lib/supabase";

export const CreatorHistory = ({ profile }: { profile: Profile }) => {
  const { tokenPrices, isLoading: isTokenPricesLoading } = useTokenPrices();

  const { tips, isHistoryLoading, isHistoryError } = useUserTipsReceived(
    profile?.wallet_address as Address
  );

  if (isHistoryLoading) {
    return <div>Loading...</div>;
  }

  if (isHistoryError) {
    return <div>Error loading history</div>;
  }

  const totalUsdTips = Object.entries(tips).reduce((acc, [key, tip]) => {
    return acc + tip.formatted * tokenPrices[key].usdPrice;
  }, 0);

  return (
    <div className="flex flex-col w-full divide-y divide-gray-200">
      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>{tips.USDC.formatted || 0} USDC</p>
        <div className="flex items-center gap-2">
          <div>
            {isTokenPricesLoading ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              `$${(tips.USDC.formatted * tokenPrices.USDC.usdPrice).toFixed(2)}`
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>{tips.ETH.formatted || 0} ETH</p>
        <div className="flex items-center gap-2">
          <div>
            {isTokenPricesLoading ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              `$${(tips.ETH.formatted * tokenPrices.ETH.usdPrice).toFixed(2)}`
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>{tips.BMACC.formatted || 0} BMACC</p>
        <div className="flex items-center gap-2">
          <div>
            {isTokenPricesLoading ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              `$${(tips.BMACC.formatted * tokenPrices.BMACC.usdPrice).toFixed(2)}`
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>Total</p>
        <div className="flex items-center gap-2">
          <div>
            {isTokenPricesLoading ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              `$${totalUsdTips.toFixed(2)}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHistory;
