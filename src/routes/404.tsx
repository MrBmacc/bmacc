import { createFileRoute } from "@tanstack/react-router";
import { PageNotFound } from "@/components/page-not-found";

export const Route = createFileRoute("/404")({
  component: PageNotFound,
});
