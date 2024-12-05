import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Coffee, Share2, Copy, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "@tanstack/react-router";
import { supabase, type Profile as ProfileType } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./edit-profile-dialog";
import { DeleteProfileDialog } from "./delete-profile-dialog";
import { Card } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const profileUrl = `${window.location.origin}/tip/${username}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("username", username)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username, toast]);

  const handleProfileUpdate = (updatedProfile: ProfileType) => {
    setProfile(updatedProfile);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleProfileDelete = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("wallet_address", profile?.wallet_address);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600">
          The profile you're looking for doesn't exist
        </p>
      </div>
    );
  }

  const isOwner =
    isConnected &&
    address?.toLowerCase() === profile.wallet_address.toLowerCase();

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl relative animate-in slide-in-from-top">
      <div className="absolute inset-x-0 -top-6 mx-auto flex justify-center max-w-xs">
        <div className="relative">
          <img
            src={
              profile.image_url ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt={profile.username}
            className="w-28 h-28 rounded-full object-cover border-4 border-white "
          />

          <div className="absolute -rotate-6 shadow top-2 right-0 transform translate-x-[calc(100%-1.5rem)] whitespace-nowrap bg-stone-100 rounded-xl px-2 py-1">
            @{profile.username}
          </div>
        </div>
      </div>
      {isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit Profile
                <DropdownMenuShortcut>
                  <Pencil size={12} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                Delete Profile
                <DropdownMenuShortcut>
                  <Trash2 size={12} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex flex-col gap-2 justify-center items-center mt-20 mb-10">
        <h1 className="text-2xl font-bold text-gray-800">
          {profile.username}'s Profile
        </h1>
        <p className="text-gray-600 text-balance">{profile.bio}</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-6">
        <div className="flex flex-col items-center justify-center space-x-6">
          <QRCodeSVG value={profileUrl} />
          <p className="text-sm text-gray-600 break-all">{profileUrl}</p>
        </div>
      </div>

      <div className="flex justify-center gap-6 mb-6">
        <Button className="flex items-center space-x-2">
          <Share2 size={18} />
          <span>Share Profile</span>
        </Button>

        <Button onClick={copyToClipboard}>
          {copied ? (
            <span className="text-green-600">Copied!</span>
          ) : (
            <>
              <Copy size={18} className="mr-2" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
      </div>

      {isOwner && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Coffee className="text-amber-600" />
            <span className="font-medium">Total Tips Received</span>
          </div>
          <span className="text-lg font-bold">0.5 ETH</span>
        </div>
      )}

      {!isOwner && (
        <Button className="w-full py-6 text-lg">
          <Coffee className="mr-2" />
          Buy me a coffee
        </Button>
      )}

      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />

      <DeleteProfileDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleProfileDelete}
      />
    </Card>
  );
}
