import { useDisconnect, useAccount } from "wagmi";
import { Search, User2, User, Menu, Wallet, Coins, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { Link } from "@tanstack/react-router";
import useStore from "@/stores/app.store";

import userImageDefault from "@/assets/default.jpg";

import { truncateAddress } from "@/utils/truncate-address";
import { useProfileStatus } from "@/hooks/use-profile-status";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonModal } from "@/components/button-modal";

export function Navigation() {
  const { open } = useAppKit();
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { setIsSearchOpen } = useStore();
  const { hasProfile, isConnected, profile } = useProfileStatus();
  const [isStuck, setIsStuck] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 1 }
    );

    // Create a dummy element just above the nav to observe
    const sentinel = document.createElement("div");
    navRef.current?.parentElement?.insertBefore(sentinel, navRef.current);

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50  ${
        isStuck
          ? "is-stuck rounded-t-none bg-brand-alt"
          : "bg-brand-alt/80 rounded-t-2xl"
      }`}
    >
      <div className="absolute inset-x-0 bg-gradient-to-r from-transparent via-white to-transparent w-full bottom-0 h-px"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a href="/" className="flex items-center">
            <img alt="BMACC" className="w-8 h-8" src="/images/bmacc-logo.png" />
            <span className="ml-2 text-4xl font-brand text-white font-bold">
              BMACC
            </span>
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

            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Menu size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>
                    {hasProfile && (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-stone-200">
                          <img
                            src={profile?.image_url || userImageDefault}
                            alt={profile?.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs flex-col w-fit">
                          {profile?.username}{" "}
                          {truncateAddress(profile?.wallet_address)}
                        </div>
                      </div>
                    )}
                    {!hasProfile && "Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {hasProfile && (
                      <DropdownMenuItem>
                        <Link
                          to="/profile/$slug"
                          params={{ slug: profile?.slug ?? "" }}
                          preload="intent"
                        >
                          View profile
                        </Link>
                        <DropdownMenuShortcut>
                          <User
                            size={16}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    {!hasProfile && (
                      <DropdownMenuItem>
                        <Link to="/create" preload="intent">
                          Create profile
                        </Link>
                        <DropdownMenuShortcut>
                          <User2
                            size={16}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {connector?.name === "AppKit Auth" && (
                      <DropdownMenuItem
                        onClick={() => {
                          open({ view: "AccountSettings" });
                        }}
                      >
                        Wallet settings
                        <DropdownMenuShortcut>
                          <Wallet
                            size={16}
                            strokeWidth={1.5}
                            className="text-muted-foreground"
                          />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        open({ view: "Account" });
                      }}
                    >
                      Top up your wallet
                      <DropdownMenuShortcut>
                        <Coins
                          size={16}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => disconnect()}>
                    Log out
                    <DropdownMenuShortcut>
                      <LogOut
                        size={16}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
