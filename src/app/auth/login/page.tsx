"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAppDispatch } from "@/lib/store";
import { loginSuccess } from "@/features/auth/authSlice";
import { UserRole } from "@/types";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const mockResponse = {
        user: {
          id: "1",
          name: "Тестовый Пользователь",
          email: data.email,
          role: "user" as UserRole,
        },
        token: "mock_jwt_token",
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(loginSuccess(mockResponse));

      router.push("/account");
    } catch  {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="mx-auto w-full max-w-md border border-gray-200 rounded-lg bg-white shadow-sm">
        <CardHeader className="p-6 space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Вход в систему
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Введите свои данные для входа
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm"
                        />
                      </FormControl>
                      <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-sm"
                        />
                      </FormControl>
                      <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-10 w-10 rounded-md hover:bg-gray-100"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm font-medium text-red-500">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full h-10 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
          <div className="text-sm text-center text-gray-500">
            Еще нет аккаунта?{" "}
            <Link href="/auth/sign-up" className="underline text-blue-500">
              Зарегистрироваться
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}