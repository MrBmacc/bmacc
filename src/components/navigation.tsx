import { useDisconnect } from "wagmi";
import { Search, User2, UserPlus } from "lucide-react";

import useStore from "@/stores/app.store";
import { useProfileStatus } from "@/hooks/use-profile-status";

import { Button } from "@/components/ui/button";
import { ButtonModal } from "@/components/button-modal";

export function Navigation() {
  const { disconnect } = useDisconnect();
  const { setIsSearchOpen } = useStore();
  const { hasProfile, isConnected, profile } = useProfileStatus();

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a href="/" className="flex items-center">
            <img alt="BMACC" className="w-8 h-8" src="/images/bmacc-logo.svg" />
            <span className="ml-2 text-xl font-bold text-gray-800">BMACC</span>
          </a>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
              <span className="sr-only">Find Creator</span>
            </Button>

            {!isConnected && !hasProfile && (
              <ButtonModal
                variant="ghost"
                screen="Connect"
                className="relative overflow-hidden flex items-center gap-3"
              >
                <User2 size={20} />
              </ButtonModal>
            )}

            {isConnected && hasProfile && (
              <Button asChild variant="ghost">
                <a href={`/profile/${profile?.username}`}>
                  <User2 size={20} />
                </a>
              </Button>
            )}

            {isConnected && !hasProfile && (
              <Button asChild variant="ghost">
                <a href="/create">
                  <UserPlus size={20} />
                </a>
              </Button>
            )}

            {isConnected && (
              <Button variant="ghost" onClick={() => disconnect()}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
