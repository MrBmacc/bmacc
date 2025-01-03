import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/page-landing";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
