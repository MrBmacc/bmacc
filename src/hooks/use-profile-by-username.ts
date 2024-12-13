import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Address } from "viem";

type Profile = {
  username: string;
  bio: string;
  slug: string;
  image_url: string;
  wallet_address: Address;
};

type ProfileByUsernameStatus = {
  isLoading: boolean;
  profile: Profile | null;
  error: Error | null;
};

export function useProfileByUsername(
  username: string
): ProfileByUsernameStatus {
  const [state, setState] = useState<ProfileByUsernameStatus>({
    isLoading: true,
    profile: null,
    error: null,
  });

  const fetchProfile = useMemo(
    () => async () => {
      if (!username) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from("profiles")
          .select()
          .eq("username", username)
          .single();

        if (supabaseError) throw new Error(supabaseError.message);
        setState({ isLoading: false, profile: data, error: null });
      } catch (err) {
        setState({
          isLoading: false,
          profile: null,
          error:
            err instanceof Error ? err : new Error("Failed to fetch profile"),
        });
      }
    },
    [username]
  );

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    fetchProfile();
  }, [fetchProfile]);

  return state;
}
