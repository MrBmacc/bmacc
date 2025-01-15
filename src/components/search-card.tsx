import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { toUrlFriendly } from "@/lib/utils";
import type { Profile } from "@/lib/supabase";
interface CreatorCardProps {
  creator: Profile;
  onClose?: () => void;
}

export function SearchCard({ creator, onClose }: CreatorCardProps) {
  const navigate = useNavigate();

  const handleTip = () => {
    navigate({
      to: "/tip/$slug",
      params: { slug: toUrlFriendly(creator.username) },
    });
    onClose?.();
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-brand-alt/30 rounded-lg transition-colors animate-in fade-in-0 slide-in-from-bottom-1">
      <img
        src={
          creator.image_url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
        alt={creator.username}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
      />
      <Link
        to="/profile/$slug"
        params={{ slug: toUrlFriendly(creator.username) }}
        preload="intent"
        className="flex-1 min-w-0 text-start"
      >
        <h3 className="font-medium text-gray-900 truncate">
          @{creator.username}
        </h3>
        <p className="text-sm text-gray-500 truncate">{creator.bio}</p>
      </Link>
      <div className="flex items-center space-x-2 flex-col">
        <Button onClick={handleTip}>Send Tip</Button>
      </div>
    </div>
  );
}
