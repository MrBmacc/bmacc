import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/profile-page";
import { fromUrlFriendly } from "@/lib/utils";

export const Route = createFileRoute("/profile/$username")({
  component: ProfilePage,
  beforeLoad: ({ params }) => {
    // Convert URL-friendly username back to original format
    return {
      username: fromUrlFriendly(params.username),
    };
  },
});
