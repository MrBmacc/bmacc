import React from "react";
import { useAccount } from "wagmi";
import { ImagePlus, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import character from "@/assets/bmacc-character.png";

import { useToast } from "@/hooks/use-toast";
import { useProfileStatus } from "@/hooks/use-profile-status";

import { toUrlFriendly } from "@/lib/utils";
import { supabase, supabaseAdmin } from "@/lib/supabase";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { ButtonCreateProfile } from "@/components/button-create-profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function CreateProfile() {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const { isLoading, hasProfile, profile } = useProfileStatus();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    username: "",
    bio: "",
    imageUrl: "",
    referrer: "",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Redirect if user already has a profile
  React.useEffect(() => {
    if (hasProfile && profile) {
      toast({
        title: "Profile Exists",
        description: "Redirecting to your profile...",
      });
      navigate({
        to: "/profile/$slug",
        params: { slug: profile.slug },
      });
    }
  }, [hasProfile, profile, navigate, toast]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabaseAdmin.storage
        .from("profile-images")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(data.path);

      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsSubmitting(true);
    try {
      // Check if username or wallet address is already in use
      const { data: existingUser } = await supabase
        .from("profiles")
        .select()
        .or(
          `username.eq.${formData.username},wallet_address.eq.${address.toLowerCase()}`
        )
        .single();

      if (existingUser) {
        const errorMessage =
          existingUser.username === formData.username
            ? "Username is already taken"
            : "Wallet address already has a profile";

        toast({
          title: "Profile exists",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (formData.username.includes("@")) {
        toast({
          title: "Invalid username",
          description: "Please do not include the @ symbol",
          variant: "destructive",
        });
        return;
      }

      // Insert profile data
      const { error } = await supabase.from("profiles").insert({
        bio: formData.bio,
        username: formData.username,
        image_url: formData.imageUrl,
        slug: toUrlFriendly(formData.username),
        wallet_address: address.toLowerCase(),
        referrer: formData.referrer,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been created.",
      });

      navigate({
        to: "/profile/$slug",
        params: { slug: formData.username },
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to create profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isConnected && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <img src={character} alt="BMACC" className="w-24" />
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="flex justify-center">
            <ButtonCreateProfile>Sign in to continue</ButtonCreateProfile>
          </div>
          <p className="text-gray-500 text-balance">
            You can connect with your wallet or sign in with Google, GitHub or
            X.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create your profile</CardTitle>
        <CardDescription>
          Set up your creator profile to start receiving tips
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  className="absolute bottom-0 right-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    "Change"
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Upload a profile picture or avatar
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be your username and will be used to identify you on
                  the platform.
                </p>
                <p className="text-xs text-gray-500">
                  Do not include the @ symbol.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referrer">Referrer</Label>

                <Input
                  id="referrer"
                  value={formData.referrer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      referrer: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  If someone referred you to the platform, enter their username
                  here.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  value={address}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate({ to: "/" })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
