import { useUserTipsReceived } from "@/hooks/use-user-tips-received";

import type { Address } from "viem";
import type { Profile } from "@/lib/supabase";

export const CreatorHistory = ({ profile }: { profile: Profile }) => {
  const { tips, isHistoryLoading, isHistoryError } = useUserTipsReceived(
    profile?.wallet_address as Address
  );

  if (isHistoryLoading) {
    return <div>Loading...</div>;
  }

  if (isHistoryError) {
    return <div>Error loading history</div>;
  }

  return (
    <div className="flex flex-col w-full divide-y divide-gray-200">
      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>USDC</p>
        {tips.USDC.formatted || 0}
      </div>

      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>USDT</p>
        {tips.USDT.formatted || 0}
      </div>

      <div className="text-sm text-gray-500 flex items-center justify-between w-full py-2">
        <p>BMACC</p>
        {tips.BMACC.formatted || 0}
      </div>
    </div>
  );
};

export default CreatorHistory;
