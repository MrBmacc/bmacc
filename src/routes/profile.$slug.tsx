import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/profile-page";

export const Route = createFileRoute("/profile/$slug")({
  component: ProfilePage,
  beforeLoad: ({ params }) => {
    // Convert URL-friendly username back to original format
    return {
      slug: params.slug,
    };
  },
});
