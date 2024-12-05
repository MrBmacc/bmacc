import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ButtonTip } from "@/components/button-tip";

import type { Profile } from "@/lib/supabase";

interface CreatorCardProps {
  creator: Profile;
  onClose?: () => void;
}

export function CreatorCard({ creator, onClose }: CreatorCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate({
      to: "/profile/$username",
      params: { username: creator.username },
    });
    onClose?.();
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <img
        src={
          creator.image_url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
        alt={creator.username}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          @{creator.username}
        </h3>
        <p className="text-sm text-gray-500 truncate">{creator.bio}</p>
      </div>
      <div className="flex items-center space-x-2">
        <ButtonTip username={creator.username} onClose={onClose} />
        <Button variant="ghost" onClick={handleViewProfile}>
          View Profile
        </Button>
      </div>
    </div>
  );
}
