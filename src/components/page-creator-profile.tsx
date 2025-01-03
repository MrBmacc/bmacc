import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  Coffee,
  Pencil,
  Trash2,
  Wallet2,
  MoreHorizontal,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "@tanstack/react-router";
import { supabase, type Profile as ProfileType } from "@/lib/supabase";

import { toUrlFriendly } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CreatorHeader } from "@/components/creator-header";
import { CreatorHistory } from "@/components/creator-history";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { DeleteProfileDialog } from "@/components/delete-profile-dialog";
import { ButtonCopyClipboard } from "@/components/button-copy-clipboard";

import { truncateAddress } from "@/utils/truncate-address";

import coffeeCup from "@/assets/takeaway-coffee.png";

export function ProfilePage() {
  const { slug } = useParams({ from: "/profile/$slug" });
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const profileUrl = `${window.location.origin}/tip/${toUrlFriendly(slug)}`;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("slug", slug)
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
  }, [slug, toast]);

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
    return <PageLoader />;
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
    <Card className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl relative animate-in slide-in-from-top ease-in-out z-10 pb-20">
      <CreatorHeader profile={profile} />
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
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex flex-col gap-2 justify-center items-center mt-20 mb-10">
        <h1 className="text-2xl font-bold text-gray-800">
          {isOwner
            ? `Your Profile (${profile.username})`
            : `${profile.username}'s`}
        </h1>

        <p className="text-gray-600 text-balance text-center">{profile.bio}</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-6">
        <div className="flex flex-col items-center justify-center space-x-6">
          <QRCodeSVG value={profileUrl} />
        </div>
      </div>

      {isOwner && (
        <>
          <div className="flex flex-col items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Coffee className="text-amber-600" />
              <span className="font-medium">Total Tips Received</span>
            </div>
            <CreatorHistory profile={profile} />
          </div>

          <Alert className="bg-gray-50 my-4">
            <div className="flex items-center gap-1">
              <Wallet2 className="h-4 w-4" />
              <AlertTitle className="mb-0">Heads up!</AlertTitle>
            </div>
            <AlertDescription className="text-sm my-1">
              Tips are sent to the wallet associated with your account:{" "}
              <ButtonCopyClipboard
                text={profile.wallet_address}
                variant="ghost"
                size="sm"
              >
                {truncateAddress(profile.wallet_address)}
              </ButtonCopyClipboard>
            </AlertDescription>
          </Alert>
        </>
      )}

      {!isOwner && (
        <Button
          asChild
          className="w-[99%] py-6 text-lg  inset-x-0 absolute bottom-1 mx-auto "
        >
          <Link to="/tip/$slug" params={{ slug }}>
            <img
              src={coffeeCup}
              alt="Coffee cup"
              className="sm:w-20 w-16 h-auto mr-2 -rotate-6 absolute sm:-top-4 -top-2 sm:left-1/4 left-6"
            />
            <span className="pl-6">BUY ME A COFFEE</span>
          </Link>
        </Button>
      )}

      <div className="flex justify-center gap-6 my-6 items-center ring-1 ring-gray-200 rounded-lg p-0.5">
        <p className="text-gray-600 break-all text-xs">{profileUrl}</p>
        <ButtonCopyClipboard text={profileUrl}>
          <Copy size={16} />
          <span className="sr-only">Copy Link</span>
        </ButtonCopyClipboard>
      </div>

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
