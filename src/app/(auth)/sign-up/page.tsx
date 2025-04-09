"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store";
import { showToast } from "@/store/slices/ui-slice";

export default function SignUp() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms & policy");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // In a real app, this would be an API call to create the user
      // For this demo, we'll simulate success and redirect to verification

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(
        showToast({
          message: "Account created! Please verify your email.",
          type: "success",
        })
      );

      router.push("/verify-email?email=" + encodeURIComponent(formData.email));
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      dispatch(
        showToast({
          message: "Registration failed. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleAppleSignIn = () => {
    signIn("apple", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-white p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-bold mb-2">Get started now</h1>
          <p className="text-gray-600 mb-8">
            Create your account and start reporting urban issues
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Password should be at least 8 characters long
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  terms & policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-ainala-blue hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Login"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="mr-2" />
              Sign in with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleAppleSignIn}
            >
              <FaApple className="mr-2" />
              Sign in with Apple
            </Button>
          </div>

          <p className="text-center mt-8 text-gray-600">
            Have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-blue-50">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md">
            <Image
              src="/images/collaboration.svg"
              alt="People collaborating"
              width={500}
              height={500}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
