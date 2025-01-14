import React from "react";

import { Coffee, Search, UserPlus, Send } from "lucide-react";

import useStore from "@/stores/app.store";
// import landingPageBg from "@/assets/coffee-shop-2.png";
import character from "@/assets/bmacc-character.png";

import { useProfileStatus } from "@/hooks/use-profile-status";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ButtonCreateProfile } from "@/components/button-create-profile";

export function LandingPage() {
  const { setIsSearchOpen } = useStore();
  const { isConnected, isLoading, hasProfile, profile } = useProfileStatus();
  return (
    <div className="relative flex flex-col min-h-[calc(100svh-12rem)] isolate ">
      <div className="flex mt-16">
        <img
          src={character}
          alt="Buy me a crypto coffee"
          className="w-80 h-auto"
        />

        {/* Hero Section */}
        <div className="flex-1 px-4 py-8 relative">
          <h1 className="text-9xl font-bold text-blue-950 tracking-tighter">
            BMACC
          </h1>
          <h2 className="text-white font-bold text-6xl">
            BUY ME A CRYPTO COFFEE
          </h2>

          <p className="sm:text-xl text-gray-600 mb-8 max-w-xl my-6">
            Go beyond likes and hearts, show real appreciation to your favorite
            creators with cryptocurrency tips. Powered by Base.
          </p>

          <div className="flex flex-row gap-4">
            {isLoading && (
              <Button disabled={true} className="animate-pulse w-36">
                Checking profile...
              </Button>
            )}

            {!isLoading && !isConnected && <ButtonCreateProfile />}

            {!isLoading && isConnected && !hasProfile && (
              <Button className="w-1/4" asChild>
                <a href="/create">
                  <UserPlus size={20} />
                  Create Profile
                </a>
              </Button>
            )}

            {!isLoading && isConnected && hasProfile && (
              <Button className="w-1/4" asChild>
                <a href={`/profile/${profile?.slug}`}>
                  <UserPlus size={20} />
                  View Profile
                </a>
              </Button>
            )}

            <span className="text-white text-xl italic">or</span>

            <Button className="w-1/4" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
              Find Creator
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="pb-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Create Profile"
              description="Set up your tipping profile in seconds with your social media accounts or crypto wallet"
              icon={<UserPlus className="text-zinc-800" size={36} />}
            />
            <FeatureCard
              title="Share Link"
              description="Get a unique link and QR code to receive tips from your supporters"
              icon={<Send className="text-zinc-800" size={36} />}
            />
            <FeatureCard
              title="Receive Tips"
              description="Get supported with crypto tips directly to your wallet on Base"
              icon={<Coffee className="text-zinc-800" size={36} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,

  description,
  icon,
}: {
  title: string;

  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative bg-white border-blue-950 border-2">
      <CardHeader className="flex flex-col items-center gap-4 space-y-0">
        {icon}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
