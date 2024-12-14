import type { Profile } from "@/lib/supabase";

export const CreatorHeader = ({ profile }: { profile: Profile }) => {
  return (
    <div className="absolute inset-x-0 -top-6 mx-auto flex justify-center max-w-xs">
      <div className="relative animate-in zoom-in delay-100 fill-mode-both ease-in-out">
        <img
          src={
            profile.image_url ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
          alt={profile.username}
          className="w-28 h-28 rounded-full object-cover border-4 border-white"
        />

        <div className="absolute -rotate-6 shadow top-2 right-0 transform translate-x-[calc(100%-1.5rem)] whitespace-nowrap bg-stone-100 rounded-xl px-2 py-1">
          @{profile.username}
        </div>
      </div>
    </div>
  );
};
