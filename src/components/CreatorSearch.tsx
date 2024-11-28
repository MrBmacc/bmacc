import React from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

type Creator = {
  address: string;
  username: string;
  image: string;
  bio: string;
};

const MOCK_CREATORS: Creator[] = [
  {
    address: '0x1234...5678',
    username: 'web3builder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Building the future of Web3'
  },
  {
    address: '0x8765...4321',
    username: 'cryptoartist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Digital artist exploring NFTs'
  }
];

export function CreatorSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<Creator[]>([]);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = MOCK_CREATORS.filter(creator => 
        creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Find Creator</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by username or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((creator) => (
                <div 
                  key={creator.address}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={creator.image}
                    alt={creator.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">@{creator.username}</h3>
                    <p className="text-sm text-gray-500">{creator.bio}</p>
                  </div>
                  <Button>View Profile</Button>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8 text-gray-500">
              No creators found matching "{searchTerm}"
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Start typing to search for creators
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}