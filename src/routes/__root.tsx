import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/navigation";
import { CreatorSearch } from "@/components/creator-search";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-[calc(100svh-3rem)] bg-gradient-to-b from-sky-200 to-stone-400 border-t border-stone-100 m-6 rounded-2xl shadow-sm relative">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>

      <Toaster />
      <CreatorSearch />
    </div>
  ),
});
