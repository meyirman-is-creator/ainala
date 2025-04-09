"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCamera, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useAppDispatch } from "@/store";
import { addIssue, updateIssue } from "@/store/slices/issues-slice";
import { showToast } from "@/store/slices/ui-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Issue, IssueCategory } from "@/types/issue";
import { createIssue, updateIssueById } from "@/lib/api-helpers";

const categories: { value: IssueCategory; label: string }[] = [
  { value: "roads", label: "Roads" },
  { value: "energy-supply", label: "Energy Supply" },
  { value: "water-supply", label: "Water Supply" },
  { value: "network", label: "Network" },
  { value: "public-transport", label: "Public Transport" },
  { value: "ecology", label: "Ecology" },
  { value: "safety", label: "Safety" },
  { value: "csc", label: "Citizens Service Center (CSC)" },
];

interface IssueFormProps {
  issue?: Issue;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function IssueForm({
  issue,
  isEditing = false,
  onSuccess,
}: IssueFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: issue?.title || "",
    category: issue?.category || ("" as IssueCategory),
    description: issue?.description || "",
    location: issue?.location?.address || "",
  });

  const [photos, setPhotos] = useState<string[]>(issue?.photos || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as IssueCategory }));

    // Clear category error
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      // In a real app, we would upload these files to a server
      // For this demo, we'll create dummy URLs
      const newPhotos = Array.from(files).map((file) => {
        return URL.createObjectURL(file);
      });

      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use reverse geocoding to get the address
          setFormData((prev) => ({
            ...prev,
            location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          dispatch(
            showToast({
              message: "Could not get your location. Please enter it manually.",
              type: "error",
            })
          );
        }
      );
    } else {
      dispatch(
        showToast({
          message: "Geolocation is not supported by your browser",
          type: "error",
        })
      );
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
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
      if (isEditing && issue) {
        // Update existing issue
        const updatedIssue = {
          ...issue,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          photos: photos,
          location: {
            ...issue.location,
            address: formData.location,
          },
          updatedAt: new Date().toISOString(),
        };

        // API call to update issue
        const response = await updateIssueById(issue.id, updatedIssue);

        if (response.success) {
          dispatch(updateIssue(updatedIssue));
          dispatch(
            showToast({
              message: "Issue updated successfully!",
              type: "success",
            })
          );

          if (onSuccess) {
            onSuccess();
          } else {
            router.push(`/issue/${issue.id}`);
          }
        } else {
          throw new Error(response.message || "Failed to update issue");
        }
      } else {
        // Create new issue
        const newIssue = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          photos: photos,
          location: formData.location
            ? { address: formData.location }
            : undefined,
        };

        // API call to create issue
        const response = await createIssue(newIssue);

        if (response.success && response.data) {
          dispatch(addIssue(response.data));
          dispatch(
            showToast({
              message: "Issue reported successfully!",
              type: "success",
            })
          );

          // Reset form and redirect
          setFormData({
            title: "",
            category: "" as IssueCategory,
            description: "",
            location: "",
          });
          setPhotos([]);

          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/my-issues");
          }
        } else {
          throw new Error(response.message || "Failed to create issue");
        }
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      dispatch(
        showToast({
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while submitting the issue",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter a clear title for the issue"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={handleCategoryChange}>
          <SelectTrigger
            id="category"
            className={errors.category ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the issue in detail..."
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={photo}
                alt={`Issue photo ${index + 1}`}
                fill
                className="object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-ainala-blue hover:border-ainala-blue transition-colors"
          >
            <FaCamera size={24} />
            <span className="mt-2 text-sm">Add Photo</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <p className="text-xs text-gray-500 mt-1">
          You can upload multiple photos to help describe the issue.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            name="location"
            placeholder="Enter the location or use current location"
            value={formData.location}
            onChange={handleChange}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            className="flex items-center"
          >
            <FaMapMarkerAlt className="mr-2" />
            Current
          </Button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-ainala-blue hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : isEditing
            ? "Update Issue"
            : "Submit Issue"}
        </Button>
      </div>
    </form>
  );
}
