import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export async function searchCreators(query: string): Promise<Profile[]> {
  if (!query) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .or(`username.ilike.%${query}%,bio.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error("Error searching creators:", error);
    throw error;
  }

  return data || [];
}
