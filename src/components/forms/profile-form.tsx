"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaSave } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { updateUserProfile } from "@/store/slices/auth-slice";
import { showToast } from "@/store/slices/ui-slice";
import { updateUserData } from "@/lib/api-helpers";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    session?.user?.image || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update form if session changes
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      setAvatarPreview(session.user.image || null);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      dispatch(
        showToast({
          message: "Please fix the errors in the form",
          type: "error",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to update user data
      const userData = {
        name: formData.name,
        email: formData.email,
        image: avatarPreview || undefined,
      };

      // API call to update user profile
      const response = await updateUserData(userData);

      if (response.success) {
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
            image: avatarPreview,
          },
        });

        // Update Redux state
        dispatch(
          updateUserProfile({
            name: formData.name,
            email: formData.email,
            avatar: avatarPreview || undefined,
          })
        );

        dispatch(
          showToast({
            message: "Profile updated successfully!",
            type: "success",
          })
        );

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      dispatch(
        showToast({
          message:
            err instanceof Error
              ? err.message
              : "Failed to update profile. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
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
                <FaUser size={40} />
              </div>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-ainala-blue text-white p-2 rounded-full shadow-md"
            onClick={handleAvatarClick}
          >
            <FaUser size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="flex">
          <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
            <FaUser className="text-gray-500" />
          </div>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`rounded-l-none ${errors.name ? "border-red-500" : ""}`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
            value={formData.email}
            onChange={handleChange}
            className={`rounded-l-none ${errors.email ? "border-red-500" : ""}`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-ainala-blue hover:bg-blue-700"
        disabled={isSubmitting}
      >
        <FaSave className="mr-2" />
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
