import React from "react";

import { Coffee, Search, UserPlus, ArrowRight } from "lucide-react";

import useStore from "@/stores/app.store";
import landingPageBg from "@/assets/coffee-shop-2.png";
import { useProfileStatus } from "@/hooks/use-profile-status";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ButtonCreateProfile } from "@/components/button-create-profile";

export function LandingPage() {
  const { setIsSearchOpen } = useStore();
  const { isConnected, isLoading, hasProfile, profile } = useProfileStatus();
  return (
    <div className="relative flex flex-col min-h-[calc(100svh-12rem)] isolate">
      <img
        src={landingPageBg}
        alt="Buy me a crypto coffee"
        className="w-full object-cover absolute inset-0 m-auto max-w-4xl h-auto [mask-image:radial-gradient(40rem_40rem_at_center,#27272a,transparent)] animate-fade-in"
      />

      {/* Hero Section */}
      <div className="flex-1  px-4 py-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-balance sm:text-5xl font-bold text-gray-900 mb-6">
            BUY ME A CRYPTO COFFEE
          </h1>
          <p className="sm:text-xl text-gray-600 mb-8 max-w-md mx-auto text-balance">
            A decentralized way to show appreciation to your favorite creators
            with cryptocurrency tips on Base
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoading && (
              <Button disabled={true} className="animate-pulse w-36">
                Checking profile...
              </Button>
            )}

            {!isLoading && !isConnected && <ButtonCreateProfile />}

            {!isLoading && isConnected && !hasProfile && (
              <Button className="w-36" asChild>
                <a href="/create">
                  <UserPlus size={20} />
                  Create Profile
                </a>
              </Button>
            )}

            {!isLoading && isConnected && hasProfile && (
              <Button className="w-36" asChild>
                <a href={`/profile/${profile?.username}`} className="">
                  <UserPlus size={20} />
                  View Profile
                </a>
              </Button>
            )}

            <Button
              variant="brand"
              className="w-36"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
              Find Creator
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Create Profile"
              number="1"
              description="Set up your tipping profile in seconds with your social media accounts or crypto wallet"
              icon={<UserPlus className="text-zinc-800" size={24} />}
            />
            <FeatureCard
              title="Share Link"
              number="2"
              description="Get a unique link and QR code to receive tips from your supporters"
              icon={<ArrowRight className="text-zinc-800" size={24} />}
            />
            <FeatureCard
              title="Receive Tips"
              number="3"
              description="Get supported with crypto tips directly to your wallet on Base"
              icon={<Coffee className="text-zinc-800" size={24} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  number,
  description,
  icon,
}: {
  title: string;
  number: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative bg-gradient-to-br from-stone-200/80 to-stone-400/60 bg-transparent border-none border-t border-stone-100">
      <div className="absolute -top-1 -right-2 rounded bg-stone-300 text-zinc-800 px-4 py-2 text-xs font-medium shadow-sm shadow-stone-700 zoom-in fill-mode-forwards delay-1000">
        <span className="text-zinc-600 font-bold text-xl">{number}</span>
      </div>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        {icon}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
