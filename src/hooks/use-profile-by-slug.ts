import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";

import type { Profile } from "@/lib/supabase";

type ProfileByUsernameStatus = {
  isLoading: boolean;
  profile: Profile | null;
  error: Error | null;
};

export function useProfileBySlug(slug: string): ProfileByUsernameStatus {
  const [state, setState] = useState<ProfileByUsernameStatus>({
    isLoading: true,
    profile: null,
    error: null,
  });

  const fetchProfile = useMemo(
    () => async () => {
      if (!slug) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from("profiles")
          .select()
          .eq("slug", slug)
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
    [slug]
  );

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    fetchProfile();
  }, [fetchProfile]);

  return state;
}
