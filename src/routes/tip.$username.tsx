import { createFileRoute } from "@tanstack/react-router";
import { Tip } from "@/components/tip-page";

export const Route = createFileRoute("/tip/$username")({
  component: Tip,
  beforeLoad: ({ params }) => {
    return {
      username: params.username,
    };
  },
  loader: ({ context }) => {
    // Access the transformed data from beforeLoad
    return {
      username: context.username,
    };
  },
});
