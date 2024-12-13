import { createFileRoute } from "@tanstack/react-router";
import { Tip } from "@/components/tip-page";

export const Route = createFileRoute("/tip/$slug")({
  component: Tip,
  beforeLoad: ({ params }) => {
    return {
      slug: params.slug,
    };
  },
  loader: ({ context }) => {
    // Access the transformed data from beforeLoad
    return {
      slug: context.slug,
    };
  },
});
