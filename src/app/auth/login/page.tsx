"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";
import { useAppDispatch } from "@/lib/store";
import { loginSuccess } from "@/features/auth/authSlice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  role: z.enum(["user", "admin", "executor"]).default("user"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Имитация запроса к API
      // В реальном приложении здесь был бы запрос к бэкенду
      const mockResponse = {
        user: {
          id: "1",
          name: "Тестовый Пользователь",
          email: data.email,
          role: data.role,
        },
        token: "mock_jwt_token",
      };

      // Задержка для имитации сетевого запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(loginSuccess(mockResponse));
      router.push("/account");
    } catch (err) {
      setError("Неверный email или пароль");
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

              {/* For demo purposes - Role selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Роль (для демонстрации)
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                            <SelectValue placeholder="Выберите роль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Пользователь</SelectItem>
                            <SelectItem value="executor">
                              Исполнитель
                            </SelectItem>
                            <SelectItem value="admin">Администратор</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FaUserShield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
