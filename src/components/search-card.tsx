import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import userImageDefault from "@/assets/default.jpg";
import type { Profile } from "@/lib/supabase";
import { toUrlFriendly } from "@/lib/utils";
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
        src={creator.image_url || userImageDefault}
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
      </Link>
      <div className="flex items-center space-x-2 flex-col">
        <Button onClick={handleTip}>Send Tip</Button>

      </div>
    </div>
  );
}
