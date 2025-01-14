import type { Profile } from "@/lib/supabase";

export const CreatorHeader = ({ profile }: { profile: Profile }) => {
  return (
    <div className="absolute inset-x-0 -top-12 mx-auto flex justify-center max-w-xs">
      <div className="flex flex-col items-center gap-2 relative animate-in zoom-in delay-100 fill-mode-both ease-in-out">
        <img
          src={
            profile.image_url ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-white"
        />
        <h3 className="">@{profile.username}</h3>
      </div>
    </div>
  );
};
