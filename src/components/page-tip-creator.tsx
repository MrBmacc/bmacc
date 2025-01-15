import { useState, useEffect, useMemo } from "react";

import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { Link, useLoaderData } from "@tanstack/react-router";

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
  const [isApproved, setIsApproved] = useState(false);
  const { hasNative, hasUsdc, hasBmacc, isLoadingUserBalance } =
    useUserBalance();

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedAmount, setSelectedAmount] = useState(tipAmounts[0].amount);

  const { slug } = useLoaderData({ from: "/tip/$slug" });

  const { fireAllMoney } = useConfetti();
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

  useEffect(() => {
    const availableCurrencies = currencies.filter((currency) => {
      switch (currency.symbol) {
        case "ETH":
          return hasNative;
        case "USDC":
          return hasUsdc;
        case "BMACC":
          return hasBmacc;
        default:
          return false;
      }
    });
    setSelectedCurrency(availableCurrencies[0] || currencies[0]);
  }, [hasNative, hasUsdc, hasBmacc]);

  // Get the recipient address from the database
  const {
    isLoading: isLoadingProfile,
    profile,
    error,
  } = useProfileBySlug(slug);

  // Check spending limit, is approval required?
  const { needsApproval, formattedCurrentAllowance, refetchAllowance } =
    useApprovalCheck({
      selectedAmount: amountInSelectedToken,
      selectedCurrency,
    });

  const { triggerApprove, isApproving } = useApproveSpend({
    totalAmount: amountInSelectedToken,
    address: selectedCurrency.address,
    decimals: selectedCurrency.decimals,
  });

  const { sendTip, error: sendTipError } = useSendTokenTip();
  const { sendTip: sendEthTip, error: sendEthTipError } = useSendEthTip();

  useEffect(() => {
    setIsPending(false);
  }, [sendTipError, sendEthTipError]);

  if (isLoadingProfile) {
    return <PageLoader />;
  }

  if (error || !profile) {
    return <div className="text-center">Error</div>;
  }

  const handleApprove = async () => {
    executeWithConnectionCheck(async () => {
      try {
        const hash = await triggerApprove();
        console.log("approvalTx", hash);

        // Optional: Add additional verification
        if (hash) {
          console.log("Waiting for confirmation...");
          await refetchAllowance();
          setIsApproved(true);
        }
      } catch (error) {
        console.error("Approval failed:", error);
        setIsApproved(false);
      }
    });
  };

  const handleTip = async () => {
    setIsPending(true);

    if (Number(amountInSelectedToken) === 0.0) {
      setIsPending(false);
      console.log("Please enter an amount greater than 0");
      return;
    }

    executeWithConnectionCheck(async () => {
      try {
        // Handle the transfer based on currency type
        if (selectedCurrency.symbol === "ETH") {
          const { success, tx } = await sendEthTip(
            profile.wallet_address,
            parseUnits(amountInSelectedToken, selectedCurrency.decimals)
          );

          if (!success) throw new Error("ETH transfer failed");
          console.log("tx", tx);
        } else {
          const { success, tx } = await sendTip(
            selectedCurrency.address,
            profile.wallet_address,
            parseUnits(amountInSelectedToken, selectedCurrency.decimals)
          );

          if (!success) throw new Error("Token transfer failed");
          console.log("tx", tx);
        }

        setIsPending(false);
        fireAllMoney({ scalar: 4 });
      } catch (error) {
        console.error("Transaction error:", error);
        setIsPending(false);
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl sm:p-6 z-10 relative p-4 min-h-[80svh] md:min-h-0">
      <CreatorHeader profile={profile} />

      <div className="text-center mb-6 mt-24">
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
                ? "border-blue-950 bg-teal-50"
                : "border-gray-200 hover:border-blue-950"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{label}</span>
              <span className="text-gray-600">{amount} USD</span>
            </div>
          </button>
        ))}
        <div className="text-gray-500 w-full py-2 px-4 rounded-lg border-2 flex items-center justify-center gap-6 focus-within:ring-2 focus-within:ring-blue-950 hover:ring-2 hover:ring-blue-950">
          <Input
            type="number"
            placeholder="Custom amount"
            className="w-full border-none mb-0 shadow-none placeholder:font-medium pl-1 placeholder:text-gray-800 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
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
          {!isApproved && needsApproval ? (
            <>
              <div className="text-red-500 text-xs text-center my-2 text-balance leading-5">
                <p>For security reasons, you need to approve spending first.</p>
                <p>
                  Your current spending limit is{" "}
                  <span className="font-bold">
                    {formattedCurrentAllowance} {selectedCurrency.symbol}
                  </span>
                </p>
              </div>
              <Button
                onClick={handleApprove}
                disabled={isPending}
                className="w-full"
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>
            </>
          ) : (
            <Button onClick={handleTip} disabled={isPending} className="w-full">
              {isPending ? "Sending..." : "Send Tip"}
            </Button>
          )}
        </>
      )}

      <Link
        className="text-sm text-muted-foreground text-center block my-3"
        to="/profile/$slug"
        params={{ slug: profile.slug }}
      >
        View {profile.username}'s Profile
      </Link>

      {isConnected && !hasNative && !isLoadingUserBalance && (
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
