import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAccount } from "wagmi";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";

export function CreateProfile() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = React.useState(true);
  const [formData, setFormData] = React.useState({
    username: "",
    bio: "",
    imageUrl: "",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Check if user already has a profile
  React.useEffect(() => {
    async function checkExistingProfile() {
      if (!address) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("wallet_address", address.toLowerCase())
          .single();

        if (profile) {
          toast({
            title: "Profile Exists",
            description: "Redirecting to your profile...",
          });
          navigate({
            to: "/profile/$username",
            params: { username: profile.username },
          });
        }
      } catch (error) {
        // No profile found, allow creation
      } finally {
        setIsChecking(false);
      }
    }

    checkExistingProfile();
  }, [address, navigate, toast]);

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
      // Check if username is available
      const { data: existingUser } = await supabase
        .from("profiles")
        .select()
        .eq("username", formData.username)
        .single();

      if (existingUser) {
        toast({
          title: "Username taken",
          description: "Please choose a different username",
          variant: "destructive",
        });
        return;
      }

      // Insert profile data
      const { error } = await supabase.from("profiles").insert({
        username: formData.username,
        bio: formData.bio,
        image_url: formData.imageUrl,
        wallet_address: address.toLowerCase(),
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been created.",
      });

      navigate({
        to: "/profile/$username",
        params: { username: formData.username },
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Connect Wallet</h2>
          <p className="text-gray-500">
            Connect your wallet to create your profile
          </p>
          <div className="pt-4">
            <w3m-button />
          </div>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
      <CardContent>
        <div className="space-y-6 mt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create Your Profile
            </h1>
            <p className="text-gray-500">
              Set up your creator profile to start receiving tips
            </p>
          </div>

          <Separator />

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
                    type="button"
                    variant="outline"
                    size="sm"
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
        </div>
      </CardContent>
    </Card>
  );
}
