import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Navigation } from "@/components/navigation";
import { Search } from "@/components/search";
import { PageNotFound } from "@/components/page-not-found";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-[calc(100svh-2rem)] bg-brand border-t border-stone-100 m-4 rounded-2xl shadow-sm relative">
      <Navigation />

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-8 pt-6 mt-16">
        <Outlet />
      </div>

      <Search />
    </div>
  ),
  notFoundComponent: () => <PageNotFound />,
});
