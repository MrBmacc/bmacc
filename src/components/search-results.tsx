import { CreatorCard } from "@/components/creator-card";
import { SearchSkeleton } from "@/components/search-skeleton";

import type { Profile } from "@/lib/supabase";

interface SearchResultsProps {
  results: Profile[];
  isLoading: boolean;
  searchTerm: string;
  onClose: () => void;
}

export const SearchResults = ({
  results,
  isLoading,
  searchTerm,
  onClose,
}: SearchResultsProps) => {
  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (results.length > 0) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-500 px-4">
          Found {results.length} {results.length === 1 ? "creator" : "creators"}
        </div>
        <div className="space-y-2">
          {results.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} onClose={onClose} />
          ))}
        </div>
      </div>
    );
  }

  if (searchTerm) {
    return (
      <div className="text-center py-8 text-gray-500">
        No creators found matching "{searchTerm}"
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500">
      Start typing to search for creators
    </div>
  );
};
