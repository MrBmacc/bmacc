import { useState, useEffect, useMemo } from "react";

import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { tipAmounts, currencies } from "@/config/constants";

import { useConfetti } from "@/hooks/use-confetti";
import { useApproveSpend } from "@/hooks/use-approve-spend";
import { useSendEthTip } from "@/hooks/use-send-eth-tip";
import { useSendTokenTip } from "@/hooks/use-send-token-tip";
import { useApprovalCheck } from "@/hooks/use-approval-check";
import { useProfileBySlug } from "@/hooks/use-profile-by-slug";
import { useConnectionCheck } from "@/hooks/use-check-connection";
import { useTokenPrices } from "@/hooks/use-token-prices";
import { useUserBalance } from "@/hooks/use-user-balance";

import { ButtonModal } from "@/components/button-modal";
import { CreatorHeader } from "@/components/creator-header";
import CurrencySelector from "@/components/currency-selector";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Tip() {
  const { isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedAmount, setSelectedAmount] = useState(tipAmounts[0].amount);

  const { slug } = useLoaderData({ from: "/tip/$slug" });

  const { fireAllMoney } = useConfetti();
  const { hasNative } = useUserBalance();
  const { tokenPrices } = useTokenPrices();
  const { executeWithConnectionCheck } = useConnectionCheck({
    desiredChainId: 8453,
  });

  // Compute the amount in USD
  const amountInSelectedToken = useMemo(() => {
    if (!tokenPrices[selectedCurrency.symbol]) return "0";
    return (
      Number(selectedAmount) / tokenPrices[selectedCurrency.symbol].usdPrice
    ).toFixed(selectedCurrency.decimals);
  }, [
    tokenPrices,
    selectedCurrency.symbol,
    selectedCurrency.decimals,
    selectedAmount,
  ]);

  // Get the recipient address from the database
  const { isLoading, profile, error } = useProfileBySlug(slug);

  // Check spending limit, approval required?
  const { needsApproval } = useApprovalCheck({
    selectedAmount: amountInSelectedToken,
    selectedCurrency,
  });

  // TODO: After approval, trigger check again
  const { triggerApprove } = useApproveSpend({
    totalAmount: amountInSelectedToken,
    address: selectedCurrency.address,
    decimals: selectedCurrency.decimals,
  });

  const { sendTip, error: sendTipError } = useSendTokenTip();
  const { sendTip: sendEthTip, error: sendEthTipError } = useSendEthTip();

  useEffect(() => {
    setIsPending(false);
  }, [sendTipError, sendEthTipError]);

  // If not enough eth for gas, set hasEthForGas to false
  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !profile) {
    return <div className="text-center">Error</div>;
  }

  const handleTip = async () => {
    setIsPending(true);

    if (amountInSelectedToken === "0") {
      setIsPending(false);
      console.log("Please enter an amount greater than 0");
      // toast.error("Please enter an amount greater than 0");
      return;
    }

    executeWithConnectionCheck(async () => {
      try {
        // For ERC20 tokens, handle approval first
        if (selectedCurrency.symbol !== "ETH" && needsApproval) {
          const hash = await triggerApprove();
          console.log("approvalTx", hash);
        }

        // Handle the actual transfer
        if (selectedCurrency.symbol === "ETH") {
          const { success, tx } = await sendEthTip(
            profile.wallet_address,
            parseUnits(amountInSelectedToken, selectedCurrency.decimals)
          );

          if (!success) {
            throw new Error("ETH transfer failed");
          }

          console.log("tx", tx);
        } else {
          const { success, tx } = await sendTip(
            selectedCurrency.address,
            profile.wallet_address,

            parseUnits(amountInSelectedToken, selectedCurrency.decimals)
          );

          if (!success) {
            throw new Error("Token transfer failed");
          }

          console.log("tx", tx);
        }

        // If we get here, the transaction was successful
        setIsPending(false);
        fireAllMoney({ scalar: 4 });
      } catch (error) {
        console.error("Transaction error:", error);
        setIsPending(false);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl sm:p-6 z-10 relative p-4">
      <CreatorHeader profile={profile} />
      <div className="text-center mb-6 mt-16">
        <h2 className="text-2xl font-bold text-gray-800">Buy me a coffee</h2>
      </div>

      <CurrencySelector
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />

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
              <span className="text-gray-600">{amount} USD</span>
            </div>
          </button>
        ))}
        <div className="text-gray-500 w-full py-2 px-4 rounded-lg border-2 flex items-center justify-center gap-6 focus-within:ring-2 focus-within:ring-teal-300">
          <Input
            type="number"
            placeholder="Custom amount"
            className="w-full border-none mb-0 shadow-none placeholder:font-medium pl-1 placeholder:text-gray-800 placeholder:text-base"
            min={1}
            onChange={(e) => setSelectedAmount(e.target.value)}
          />
          <span className="text-gray-600">USD</span>
        </div>
      </div>

      {!isConnected && (
        <ButtonModal screen="Connect" className="w-full">
          Please connect your wallet to send a tip.
        </ButtonModal>
      )}

      {isConnected && hasNative && (
        <>
          {needsApproval && (
            <div className="text-red-500 text-xs text-center my-2 text-balance">
              For security reasons, you will be asked to approve a spending cap.
            </div>
          )}

          <Button onClick={handleTip} disabled={isPending} className="w-full">
            {isPending ? "Sending..." : "Send Tip"}
          </Button>

          <Link
            className="text-sm text-muted-foreground text-center block my-3"
            to="/profile/$slug"
            params={{ slug: profile.slug }}
          >
            View {profile.username}'s Profile
          </Link>
        </>
      )}

      {isConnected && !hasNative && (
        <Alert variant="destructive" className="bg-red-300/10 text-center">
          <AlertTitle>Oh dang!</AlertTitle>
          <AlertDescription className="text-balance">
            Looks like you don't have enough ETH for gas.{" "}
            <a
              href="https://earn.brewlabs.info/swap"
              target="_blank"
              className="underline"
            >
              Please top up your wallet
            </a>
            .
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
