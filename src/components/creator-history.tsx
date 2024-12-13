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
    <div className="flex flex-col gap-4">
      {tips.USDC.formatted > 0 && (
        <span className="text-sm text-gray-500">
          {tips.USDC.formatted} USDC
        </span>
      )}
      {tips.USDT.formatted > 0 && (
        <span className="text-sm text-gray-500">
          {tips.USDT.formatted} USDT
        </span>
      )}
    </div>
  );
};

export default CreatorHistory;
