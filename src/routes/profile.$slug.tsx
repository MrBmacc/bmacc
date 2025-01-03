import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfilePage } from "@/components/page-creator-profile";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/profile/$slug")({
  component: ProfilePage,
  beforeLoad: async ({ params }) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("slug", params.slug)
        .single();

      if (error || !data) {
        throw redirect({
          to: "/404",
        });
      }

      return {
        slug: params.slug,
      };
    } catch (error) {
      throw redirect({
        to: "/404",
      });
    }
  },
});
