import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Navigation } from "@/components/navigation";
import { CreatorSearch } from "@/components/creator-search";
import { PageNotFound } from "@/components/page-not-found";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-[calc(100svh-2rem)] bg-gradient-to-b from-sky-300 to-stone-400 border-t border-stone-100 m-4 rounded-2xl shadow-sm relative before:fixed before:inset-0 before:bg-noise before:opacity-[0.015] before:pointer-events-none before:-z-10 after:fixed after:inset-0 after:bg-scanline after:pointer-events-none after:animate-scanline">
      <Navigation />

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-8 pt-6">
        <Outlet />
      </div>

      <CreatorSearch />
    </div>
  ),
  notFoundComponent: () => <PageNotFound />,
});
