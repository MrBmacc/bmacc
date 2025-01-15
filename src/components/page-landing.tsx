import React from "react";

import { Coffee, Search, UserPlus, Send } from "lucide-react";

import useStore from "@/stores/app.store";
import character from "@/assets/bmacc-character.png";

import { useProfileStatus } from "@/hooks/use-profile-status";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ButtonCreateProfile } from "@/components/button-create-profile";

export function LandingPage() {
  const { setIsSearchOpen } = useStore();
  const { isConnected, isLoading, hasProfile, profile } = useProfileStatus();
  return (
    <div className="relative flex flex-col">
      <div className="flex md:mt-16 mt-0 flex-col md:flex-row-reverse justify-between gap-8">
        {/* Hero Section */}
        <div className=" px-4 py-8 relative flex-1">
          <h1 className="text-7xl md:text-9xl font-bold text-blue-950 tracking-tighter font-brand">
            BMACC
          </h1>
          <h2 className="text-white font-bold text-4xl md:text-6xl font-brand">
            BUY ME A CRYPTO COFFEE
          </h2>

          <p className="sm:text-xl text-gray-600 mb-8 max-w-xl my-6">
            Go beyond likes and hearts, show real appreciation to your favorite
            creators with cryptocurrency tips.{" "}
            <a
              href="https://www.base.org/"
              target="_blank"
              className="underline"
            >
              Powered by Base.
            </a>
          </p>

          <div className="flex flex-row gap-4 flex-wrap">
            {isLoading && (
              <Button disabled={true} className="animate-pulse sm:w-44 w-full">
                Checking profile...
              </Button>
            )}

            {!isLoading && !isConnected && (
              <ButtonCreateProfile className="sm:w-44 w-full" />
            )}

            {!isLoading && isConnected && !hasProfile && (
              <Button className="sm:w-44 w-full" asChild>
                <a href="/create">
                  <UserPlus size={20} />
                  Create Profile
                </a>
              </Button>
            )}

            {!isLoading && isConnected && hasProfile && (
              <Button className="sm:w-44 w-full" asChild>
                <a href={`/profile/${profile?.slug}`}>
                  <UserPlus size={20} />
                  View Profile
                </a>
              </Button>
            )}

            <span className="text-white text-xl italic hidden md:block">
              or
            </span>

            <Button
              className="sm:w-44 w-full"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
              Find Creator
            </Button>
          </div>
        </div>

        <img
          src={character}
          alt="Buy me a crypto coffee"
          className="w-80 h-auto"
        />
      </div>

      {/* Features Section */}
      <div className="pb-8 px-4 relative">
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
