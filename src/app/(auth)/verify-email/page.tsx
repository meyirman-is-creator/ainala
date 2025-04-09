"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { showToast } from "@/store/slices/ui-slice";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const dispatch = useAppDispatch();

  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (remainingTime > 0 && !canResend) {
      const timer = setTimeout(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && !canResend) {
      setCanResend(true);
    }
  }, [remainingTime, canResend]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      dispatch(
        showToast({
          message: "Please enter the verification code",
          type: "error",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to verify the code
      // For this demo, we'll simulate success with any 6-digit code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        setIsVerified(true);
        dispatch(
          showToast({
            message: "Email verified successfully!",
            type: "success",
          })
        );

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        dispatch(
          showToast({
            message: "Invalid verification code. Please try again.",
            type: "error",
          })
        );
      }
    } catch (err) {
      dispatch(
        showToast({
          message: "Verification failed. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setRemainingTime(60);

    // In a real app, this would resend the verification code
    dispatch(
      showToast({
        message: "Verification code resent!",
        type: "success",
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-white p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {isVerified ? (
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-8">
                Your email has been successfully verified. You will be
                redirected to the sign-in page shortly.
              </p>
              <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                <Link href="/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                <FaEnvelope className="text-ainala-blue text-2xl" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-center">
                Verify your email
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                We've sent a verification code to <strong>{email}</strong>.
                Please enter the code below to verify your email.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    className="text-center text-lg py-6"
                    maxLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ainala-blue hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                {canResend ? (
                  <button
                    onClick={handleResendCode}
                    className="text-ainala-blue hover:underline"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p className="text-gray-500">
                    Resend code in {remainingTime} seconds
                  </p>
                )}
              </div>

              <p className="text-center mt-8 text-gray-600">
                Return to{" "}
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-blue-50">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md">
            <Image
              src="/images/email-verification.svg"
              alt="Email verification"
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
