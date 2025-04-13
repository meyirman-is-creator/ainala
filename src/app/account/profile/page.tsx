"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { updateUser } from "@/features/auth/authSlice";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Неверный формат email"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов"),
    newPassword: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setLoadingProfile(true);
    setError(null);
    setSuccess(null);

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Обновление данных пользователя в Redux
      dispatch(
        updateUser({
          ...user!,
          name: data.name,
          email: data.email,
        })
      );

      setSuccess("Профиль успешно обновлен");
    } catch (err) {
      setError("Ошибка при обновлении профиля");
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoadingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Пароль успешно изменен");
    } catch (err) {
      setError("Ошибка при изменении пароля");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Профиль</h1>
        <p className="text-gray-500">
          Управляйте своими персональными данными и безопасностью
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <CardHeader className="flex flex-col space-y-1.5 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Аватар
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Изображение, которое будет отображаться в вашем профиле
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 relative rounded-full overflow-hidden">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-4">
                  <Label
                    htmlFor="avatar"
                    className="block text-sm font-medium mb-1"
                  >
                    Выберите новый аватар
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button className="bg-blue-500 text-white hover:bg-blue-600 flex items-center h-10 px-4 py-2 rounded-md">
                      <FaCamera className="mr-2" />
                      Загрузить
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </Button>
                    <Button className="border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2 rounded-md">
                      Удалить
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Рекомендуемый размер: 256x256 пикселей. Формат: JPG или PNG.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
            <TabsTrigger
              value="profile"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
            >
              Профиль
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
            >
              Безопасность
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <CardHeader className="flex flex-col space-y-1.5 p-6">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Личная информация
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Обновите свои личные данные
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
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
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
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
                    {error && (
                      <div className="text-sm font-medium text-red-500">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm font-medium text-green-600">
                        {success}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={loadingProfile}
                      className="bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 rounded-md"
                    >
                      {loadingProfile ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <CardHeader className="flex flex-col space-y-1.5 p-6">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Изменение пароля
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Обновите свой пароль для повышения безопасности
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Текущий пароль
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showCurrentPassword ? "text" : "password"}
                                {...field}
                                className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              className="absolute right-0 top-0 h-10 w-10 rounded-md hover:bg-gray-100"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
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
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Новый пароль
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showNewPassword ? "text" : "password"}
                                {...field}
                                className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              className="absolute right-0 top-0 h-10 w-10 rounded-md hover:bg-gray-100"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
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
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Подтверждение пароля
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              className="absolute right-0 top-0 h-10 w-10 rounded-md hover:bg-gray-100"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
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
                      <div className="text-sm font-medium text-red-500">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm font-medium text-green-600">
                        {success}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={loadingPassword}
                      className="bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 rounded-md"
                    >
                      {loadingPassword ? "Изменение..." : "Изменить пароль"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
