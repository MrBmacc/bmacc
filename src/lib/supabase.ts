import { createClient } from "@supabase/supabase-js";
import type { Address } from "viem";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Regular client for database operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service role client for storage operations
export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// Storage bucket name constant
export const STORAGE_BUCKET = "profile-images";

export type Profile = {
  id: string;
  username: string;
  bio: string;
  slug: string;
  image_url: string;
  wallet_address: Address;
  created_at: string;
};
