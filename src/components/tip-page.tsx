import { useState } from "react";
import { Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { parseUnits } from "viem";

import { tipAmounts, currencies } from "@/config/constants";

import { fromUrlFriendly } from "@/lib/utils";

import { useApproveSpend } from "@/hooks/use-approve-spend";
import { useSendTokenTip } from "@/hooks/use-send-token-tip";
import { useApprovalCheck } from "@/hooks/use-approval-check";
import { useProfileBySlug } from "@/hooks/use-profile-by-slug";
import { useConnectionCheck } from "@/hooks/use-check-connection";

export function Tip() {
  const [isPending, setIsPending] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedAmount, setSelectedAmount] = useState(tipAmounts[0].amount);

  const { slug } = useLoaderData({ from: "/tip/$slug" });

  const { executeWithConnectionCheck } = useConnectionCheck({
    desiredChainId: 8453,
  });

  // Get the recipient address from the database
  const { isLoading, profile, error } = useProfileBySlug(slug);

  // Check spending limit, approval required?
  const { needsApproval } = useApprovalCheck({
    selectedAmount,
    selectedCurrency,
  });

  // TODO: After approval, trigger check again
  const { triggerApprove } = useApproveSpend({
    totalAmount: selectedAmount,
    address: selectedCurrency.address,
    decimals: selectedCurrency.decimals,
  });

  const { sendTip } = useSendTokenTip();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // TODO: An actual 404 would be nice
  if (error || !profile) {
    return <div>Error</div>;
  }

  const handleTip = async () => {
    //
    setIsPending(true);

    // Update to proceed with tip
    executeWithConnectionCheck(async () => {
      if (needsApproval) {
        // Maybe return a promise so we can proceed with tip after approval
        triggerApprove();
        return;
      }

      const tx = await sendTip(
        selectedCurrency.address,
        profile.wallet_address,
        parseUnits(selectedAmount, selectedCurrency.decimals)
      );

      // TODO: Implement tip success
      console.log("tx", tx);

      // Implementation for sending tip transaction
      // This is a placeholder - you'll need to implement the actual contract interaction
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
      <div className="text-center mb-6">
        <Coffee className="mx-auto text-amber-600 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Buy me a coffee</h2>
        <p className="text-gray-600">
          Support{" "}
          <span className="underline">{fromUrlFriendly(profile.username)}</span>
          . Show love with crypto!
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Currency
        </label>
        <div className="grid grid-cols-3 gap-2">
          {currencies.map((currency) => (
            <button
              key={currency.symbol}
              onClick={() => setSelectedCurrency(currency)}
              className={`p-2 rounded-lg border-2 transition-all ${
                selectedCurrency.symbol === currency.symbol
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              {currency.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {tipAmounts.map(({ amount, label }) => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedAmount === amount
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{label}</span>
              <span className="text-gray-600">
                {amount} {selectedCurrency.symbol}
              </span>
            </div>
          </button>
        ))}
      </div>

      {needsApproval && (
        <div className="text-red-500 text-xs text-center my-2">
          For security reasons, you will be asked to approve a spending cap.
        </div>
      )}

      <Button onClick={handleTip} disabled={isPending} className="w-full">
        {isPending ? "Sending..." : "Send Tip"}
      </Button>

      <Link
        className="text-sm text-muted-foreground text-center block my-2"
        to="/profile/$slug"
        params={{ slug: profile.slug }}
      >
        View Profile
      </Link>
    </div>
  );
}
