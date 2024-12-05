import React from "react";

import useStore from "@/stores/app.store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/search-input";
import { SearchResults } from "@/components/search-results";

import { useToast } from "@/hooks/use-toast";

import { searchCreators } from "@/lib/api";
import type { Profile } from "@/lib/supabase";

export function CreatorSearch() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<Profile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { isSearchOpen, setIsSearchOpen } = useStore();

  React.useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const creators = await searchCreators(searchTerm);
        setResults(creators);
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Error",
          description: "Failed to search creators. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, toast]);

  return (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Find Creator</DialogTitle>
        </DialogHeader>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by username or bio..."
        />

        <div className="max-h-[60vh] overflow-y-auto">
          <SearchResults
            results={results}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
