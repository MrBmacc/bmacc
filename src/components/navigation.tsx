import React from "react";
import { Search, User2Icon } from "lucide-react";

import { CreatorSearch } from "@/components/CreatorSearch";
import { Button } from "@/components/ui/button";
export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <a href="/" className="flex items-center">
              <img
                alt="BMACC"
                className="w-8 h-8"
                src="/images/bmacc-logo.svg"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">
                BMACC
              </span>
            </a>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
                <span className="sr-only">Find Creator</span>
              </Button>

              <Button variant="ghost">
                <User2Icon size={20} />
              </Button>

              {/* <appkit-button label="Sign in" /> */}
            </div>
          </div>
        </div>
      </nav>

      <CreatorSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
