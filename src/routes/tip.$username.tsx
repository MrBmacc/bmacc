import { createFileRoute } from "@tanstack/react-router";
import { Tip } from "@/components/tip";

export const Route = createFileRoute("/tip/$username")({
  component: Tip,
});
