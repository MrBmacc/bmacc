import { useAccount } from "wagmi";
import { Coffee } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

interface TipButtonProps {
  username: string;
  onClose?: () => void;
}

export function ButtonTip({ username, onClose }: TipButtonProps) {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const handleTip = () => {
    if (!isConnected) {
      // If not connected, the w3m-button in Navigation will handle connection
      return;
    }
    navigate({ to: "/tip/$username", params: { username } });
    onClose?.();
  };

  return (
    <Button
      onClick={handleTip}
      variant="outline"
      className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
    >
      <Coffee className="w-4 h-4 mr-2" />
      Send Tip
    </Button>
  );
}
