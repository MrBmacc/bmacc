import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { parseUnits } from "viem";

import { tipAmounts, currencies } from "@/config/constants";

import { useConfetti } from "@/hooks/use-confetti";
import { useApproveSpend } from "@/hooks/use-approve-spend";
import { useSendTokenTip } from "@/hooks/use-send-token-tip";
import { useApprovalCheck } from "@/hooks/use-approval-check";
import { useProfileBySlug } from "@/hooks/use-profile-by-slug";
import { useConnectionCheck } from "@/hooks/use-check-connection";

import { CreatorHeader } from "@/components/creator-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Tip() {
  const [isPending, setIsPending] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedAmount, setSelectedAmount] = useState(tipAmounts[0].amount);

  const { slug } = useLoaderData({ from: "/tip/$slug" });

  //const { fireConfetti } = useConfetti();
  const { fireMoneyShower, fireAllMoney } = useConfetti();

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

  const { sendTip, error: sendTipError } = useSendTokenTip();

  useEffect(() => {
    setIsPending(false);
  }, [sendTipError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-300" />
      </div>
    );
  }

  // TODO: An actual 404 would be nice
  if (error || !profile) {
    return <div>Error</div>;
  }

  const handleTip = async () => {
    // set state to pending
    setIsPending(true);
    // Update to proceed with tip
    executeWithConnectionCheck(async () => {
      if (needsApproval) {
        try {
          const hash = await triggerApprove();
          console.log("approvalTx", hash);
          // hash is the transaction hash
          // you can wait for transaction receipt if needed
        } catch (error) {
          // Handle error
          console.error("Approval error:", error);
          setIsPending(false);
          return;
        }
      }

      try {
        const { success, tx } = await sendTip(
          selectedCurrency.address,
          profile.wallet_address,
          parseUnits(selectedAmount, selectedCurrency.decimals)
        );

        if (success) {
          console.log("tx", tx);
          setIsPending(false);
          fireAllMoney({ scalar: 4 });
        } else {
          console.error("Transaction error");
          setIsPending(false);
          return;
        }
      } catch (error) {
        // Handle error
        console.error("Transaction error:", error);
        setIsPending(false);
        return;
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto rounded-2xl shadow-xl p-6 z-10 relative">
      <CreatorHeader profile={profile} />
      <div className="text-center mb-6 mt-16">
        <h2 className="text-2xl font-bold text-gray-800">Buy me a coffee</h2>
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
                  ? "border-teal-300 bg-teal-50"
                  : "border-gray-200 hover:border-teal-400"
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
                ? "border-teal-300 bg-teal-50"
                : "border-gray-200 hover:border-teal-400"
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
        <div className=" text-gray-500 w-full p-2 rounded-lg border-2 flex items-center justify-center gap-6 focus-within:ring-2 focus-within:ring-teal-300">
          <Input
            type="number"
            placeholder="Custom amount"
            className="w-full border-none mb-1"
            min={1}
            onChange={(e) => setSelectedAmount(e.target.value)}
          />
          <span className="text-gray-600">{selectedCurrency.symbol}</span>
        </div>
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
    </Card>
  );
}
