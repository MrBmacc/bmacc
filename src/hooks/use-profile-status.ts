import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/lib/supabase";

type ProfileStatus = {
  isConnected: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  profile: {
    username: string;
    bio: string;
    image_url: string;
    wallet_address: string;
  } | null;
  isAuthenticated: boolean;
};

export function useProfileStatus(): ProfileStatus {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function checkProfile() {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("profiles")
          .select()
          .eq("wallet_address", address.toLowerCase())
          .single();

        setProfile(data);
      } catch (error) {
        // No profile found or error occurred
        console.error("Error checking profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkProfile();
  }, [address]);

  return {
    isConnected,
    isLoading,
    hasProfile: !!profile,
    profile,
    isAuthenticated: isConnected && !!profile,
  };
}
