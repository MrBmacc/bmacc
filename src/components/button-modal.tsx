import { useAppKit } from "@reown/appkit/react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

type ModalScreen =
  | "Account"
  | "AccountSettings"
  | "SelectAddresses"
  | "AllWallets"
  | "ApproveTransaction"
  | "BuyInProgress"
  | "WalletCompatibleNetworks"
  | "ChooseAccountName"
  | "Connect"
  | "ConnectingExternal"
  | "ConnectingFarcaster"
  | "ConnectingWalletConnect"
  | "ConnectingSiwe"
  | "ConnectingSocial"
  | "ConnectSocials"
  | "ConnectWallets"
  | "Downloads"
  | "EmailVerifyOtp"
  | "EmailVerifyDevice"
  | "GetWallet"
  | "Networks"
  | "OnRampActivity"
  | "OnRampFiatSelect"
  | "OnRampProviders"
  | "OnRampTokenSelect"
  | "Profile"
  | "RegisterAccountName"
  | "RegisterAccountNameSuccess"
  | "SwitchNetwork"
  | "SwitchAddress"
  | "Transactions"
  | "UnsupportedChain"
  | "UpdateEmailWallet"
  | "UpdateEmailPrimaryOtp"
  | "UpdateEmailSecondaryOtp"
  | "UpgradeEmailWallet"
  | "UpgradeToSmartAccount"
  | "WalletReceive"
  | "WalletSend"
  | "WalletSendPreview"
  | "WalletSendSelectToken"
  | "WhatIsANetwork"
  | "WhatIsAWallet"
  | "WhatIsABuy"
  | "Swap"
  | "SwapSelectToken"
  | "SwapPreview"
  | (string & {});

interface ModalButtonProps extends ButtonProps {
  screen: ModalScreen;
  children?: ReactNode;
}

export const ButtonModal = ({
  screen,
  children,
  ...buttonProps
}: ModalButtonProps) => {
  const { open } = useAppKit();

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        open({ view: screen as any });
      }}
    >
      {children}
    </Button>
  );
};
