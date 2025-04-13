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
  
  const handleComplete = async (value: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Имитация запроса к API
      // В реальном приложении здесь был бы запрос к бэкенду
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Перенаправление на страницу входа
      router.push("/auth/login");
    } catch (err) {
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
    } catch (err) {
      setError("Ошибка при отправке кода");
    } finally {
      setResending(false);
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Подтверждение email
          </CardTitle>
          <CardDescription>
            Мы отправили 6-значный код подтверждения на ваш email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center py-4">
            <FaEnvelope className="h-12 w-12 text-primary" />
          </div>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
              onComplete={handleComplete}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && (
            <div className="text-sm font-medium text-destructive text-center">
              {error}
            </div>
          )}
          <div className="text-sm text-center text-gray-500">
            Не получили код?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={handleResendCode}
              disabled={resending}
            >
              {resending ? "Отправка..." : "Отправить снова"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full">
              Вернуться к входу
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}