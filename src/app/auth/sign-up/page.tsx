"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Имитация запроса к API
      // В реальном приложении здесь был бы запрос к бэкенду
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Перенаправление на страницу верификации
      router.push("/auth/verify-email");
    } catch  {
      setError("Ошибка при регистрации. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="mx-auto max-w-md w-full border border-gray-200 rounded-lg bg-white shadow-sm">
        <CardHeader className="space-y-1 p-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Регистрация
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Создайте аккаунт для репортинга городских проблем
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Имя
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Иван Иванов"
                          {...field}
                          className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                        />
                      </FormControl>
                      <FaUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Email
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                        />
                      </FormControl>
                      <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Пароль
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                        />
                      </FormControl>
                      <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Button
                        type="button"
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
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-sm font-medium text-red-500">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
          <div className="text-sm text-center text-gray-500">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="underline text-blue-500">
              Войти
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
