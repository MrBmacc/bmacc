import React from "react";
import { Coffee } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
const tipAmounts = [
  { amount: "0.001", label: "Small Coffee" },
  { amount: "0.003", label: "Large Coffee" },
  { amount: "0.005", label: "Coffee + Snack" },
];

export function Tip({ recipientAddress }: { recipientAddress: string }) {
  const { isConnected } = useAccount();
  const [isPending, setIsPending] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(
    tipAmounts[0].amount
  );

  console.log(recipientAddress);

  const handleTip = async () => {
    if (!isConnected) return;

    // Implementation for sending tip transaction
    // This is a placeholder - you'll need to implement the actual contract interaction
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
      <div className="text-center mb-6">
        <Coffee className="mx-auto text-amber-600 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Buy me a coffee</h2>
        <p className="text-gray-600">Support my work with crypto!</p>
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
              <span className="text-gray-600">{amount} ETH</span>
            </div>
          </button>
        ))}
      </div>

      <Button onClick={handleTip} disabled={isPending} className="w-full">
        {isPending ? "Sending..." : "Send Tip"}
      </Button>
    </div>
  );
}
