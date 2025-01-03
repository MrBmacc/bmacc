import { createFileRoute } from "@tanstack/react-router";
import { CreateProfile } from "@/components/page-create-profile";

export const Route = createFileRoute("/create")({
  component: CreateProfile,
});
