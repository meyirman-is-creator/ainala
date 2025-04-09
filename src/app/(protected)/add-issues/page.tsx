"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCamera, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useAppDispatch } from "@/store";
import { addIssue } from "@/store/slices/issues-slice";
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
import { IssueCategory } from "@/types/issue";

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

export default function AddIssuePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "" as IssueCategory,
    description: "",
    location: "",
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as IssueCategory }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      dispatch(
        showToast({
          message: "Please enter a title for the issue",
          type: "error",
        })
      );
      return;
    }

    if (!formData.category) {
      dispatch(
        showToast({
          message: "Please select a category",
          type: "error",
        })
      );
      return;
    }

    if (!formData.description.trim()) {
      dispatch(
        showToast({
          message: "Please provide a description",
          type: "error",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, we would make an API call to create the issue
      // For this demo, we'll add the issue directly to the Redux store
      const newIssue = {
        id: `issue-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: "to-do" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "user1", // Would come from session
        userName: "Antonio Banderas", // Would come from session
        photos: photos,
        likes: 0,
        comments: [],
        location: {
          latitude: 0,
          longitude: 0,
          address: formData.location || "Location not specified",
        },
      };

      dispatch(addIssue(newIssue));

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

      router.push("/my-issues");
    } catch (error) {
      console.error("Error submitting issue:", error);
      dispatch(
        showToast({
          message: "An error occurred while reporting the issue",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter a clear title for the issue"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category" className="w-full">
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Photos</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
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
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
