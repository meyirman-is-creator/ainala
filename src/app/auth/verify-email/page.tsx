"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function VerifyEmailPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Перенаправление на страницу входа
      router.push("/auth/login");
    } catch {
      setError("Неверный код подтверждения");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError(null);

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch {
      setError("Ошибка при отправке кода");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="mx-auto max-w-md w-full border border-gray-200 rounded-lg bg-white shadow-sm">
        <CardHeader className="space-y-1 p-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Подтверждение email
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Мы отправили 6-значный код подтверждения на ваш email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-center py-4">
            <FaEnvelope className="h-12 w-12 text-blue-500" />
          </div>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(val) => setValue(val)}
              onComplete={handleComplete}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
                <InputOTPSlot
                  className="h-10 w-10 relative flex items-center justify-center rounded-md border border-gray-200 bg-white"
                  isActive={false}
                  char=""
                  placeholderChar=" "
                  hasFakeCaret={false}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && (
            <div className="text-sm font-medium text-red-500 text-center">
              {error}
            </div>
          )}
          <div className="text-sm text-center text-gray-500">
            Не получили код?{" "}
            <Button
              className="p-0 h-auto text-blue-500 bg-transparent hover:bg-transparent hover:underline"
              onClick={handleResendCode}
              disabled={resending}
            >
              {resending ? "Отправка..." : "Отправить снова"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 h-10 px-4 py-2 rounded-md">
              Вернуться к входу
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
