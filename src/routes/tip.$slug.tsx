import { createFileRoute, redirect } from "@tanstack/react-router";
import { Tip } from "@/components/page-tip-creator";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/tip/$slug")({
  component: Tip,
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
  loader: ({ context }) => {
    // Access the transformed data from beforeLoad
    return {
      slug: context.slug,
    };
  },
});
