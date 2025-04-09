"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaUser, FaCamera, FaKey, FaEnvelope, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/store";
import { updateUserProfile } from "@/store/slices/auth-slice";
import { showToast } from "@/store/slices/ui-slice";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    session?.user?.image || null
  );

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPersonal(true);

    try {
      // In a real app, this would be an API call to update user data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: personalInfo.name,
          email: personalInfo.email,
          image: avatarPreview,
        },
      });

      // Update Redux state
      dispatch(
        updateUserProfile({
          name: personalInfo.name,
          email: personalInfo.email,
          avatar: avatarPreview || undefined,
        })
      );

      dispatch(
        showToast({
          message: "Profile updated successfully!",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: "Failed to update profile. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      dispatch(
        showToast({
          message: "New passwords do not match",
          type: "error",
        })
      );
      return;
    }

    if (passwordInfo.newPassword.length < 8) {
      dispatch(
        showToast({
          message: "Password must be at least 8 characters long",
          type: "error",
        })
      );
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // In a real app, this would be an API call to update password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      dispatch(
        showToast({
          message: "Password updated successfully!",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: "Failed to update password. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-white rounded-lg p-6 shadow-sm">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <FaUser size={48} />
              </div>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 bg-ainala-blue text-white p-2 rounded-full shadow-md"
            onClick={handleAvatarClick}
          >
            <FaCamera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">
            {session?.user?.name || "User"}
          </h2>
          <p className="text-gray-600">
            {session?.user?.email || "user@example.com"}
          </p>

          {session?.user?.role === "admin" && (
            <div className="mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Administrator
              </span>
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-700">
              Member since: <span className="font-medium">April 2023</span>
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePersonalInfo}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      <FaUser className="text-gray-500" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="bg-ainala-blue hover:bg-blue-700"
                  disabled={isUpdatingPersonal}
                >
                  <FaSave className="mr-2" />
                  {isUpdatingPersonal ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      <FaKey className="text-gray-500" />
                    </div>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordInfo.currentPassword}
                      onChange={handlePasswordChange}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      <FaKey className="text-gray-500" />
                    </div>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={handlePasswordChange}
                      className="rounded-l-none"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      <FaKey className="text-gray-500" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={handlePasswordChange}
                      className="rounded-l-none"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="bg-ainala-blue hover:bg-blue-700"
                  disabled={isUpdatingPassword}
                >
                  <FaKey className="mr-2" />
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
