import { useDisconnect } from "wagmi";
import { Search, User2, UserPlus, LogOut } from "lucide-react";

import useStore from "@/stores/app.store";

import { truncateAddress } from "@/utils/truncate-address";
import { useProfileStatus } from "@/hooks/use-profile-status";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonModal } from "@/components/button-modal";

export function Navigation() {
  const { disconnect } = useDisconnect();
  const { setIsSearchOpen } = useStore();
  const { hasProfile, isConnected, profile } = useProfileStatus();

  return (
    <nav className="sticky top-0 z-50 bg-brand-alt rounded-t-2xl ">
      <div className="absolute inset-x-0 bg-gradient-to-r from-transparent via-white to-transparent w-full bottom-0 h-px"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a href="/" className="flex items-center">
            <img alt="BMACC" className="w-8 h-8" src="/images/bmacc-logo.png" />
            <span className="ml-2 text-3xl font-bold text-white">BMACC</span>
          </a>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="brand"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full w-8 h-8"
            >
              <Search size={20} />
              <span className="sr-only">Find Creator</span>
            </Button>

            {!isConnected && (
              <ButtonModal
                size="icon"
                variant="ghost"
                screen="Connect"
                className="relative overflow-hidden flex items-center gap-3 rounded-full w-8 h-8 ring-2 ring-white"
              >
                <User2 size={20} />
                <span className="sr-only">Connect</span>
              </ButtonModal>
            )}

            {isConnected && hasProfile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                      <a href={`/profile/${profile?.slug}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                          <img
                            src={profile?.image_url}
                            alt={profile?.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{profile?.username}</p>
                    <p>{truncateAddress(profile?.wallet_address)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {isConnected && !hasProfile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="rounded-full w-8 h-8"
                    >
                      <a href="/create">
                        <UserPlus size={20} />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {isConnected && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full w-8 h-8"
                      onClick={() => disconnect()}
                    >
                      <LogOut size={20} />
                      <span className="sr-only">Disconnect</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disconnect wallet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
