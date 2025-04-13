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
        <p className="text-muted-foreground">
          Управляйте своими персональными данными и безопасностью
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Аватар</CardTitle>
            <CardDescription>
              Изображение, которое будет отображаться в вашем профиле
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white text-2xl">
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
                    <Button className="flex items-center">
                      <FaCamera className="mr-2" />
                      Загрузить
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </Button>
                    <Button variant="outline">Удалить</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Рекомендуемый размер: 256x256 пикселей. Формат: JPG или PNG.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="password">Безопасность</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>Обновите свои личные данные</CardDescription>
              </CardHeader>
              <CardContent>
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
                          <FormLabel>Имя</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="Иван Иванов"
                                {...field}
                                className="pl-10"
                              />
                            </FormControl>
                            <FaUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="email@example.com"
                                {...field}
                                className="pl-10"
                              />
                            </FormControl>
                            <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-sm font-medium text-destructive">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm font-medium text-green-600">
                        {success}
                      </div>
                    )}
                    <Button type="submit" disabled={loadingProfile}>
                      {loadingProfile ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Изменение пароля</CardTitle>
                <CardDescription>
                  Обновите свой пароль для повышения безопасности
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <FormLabel>Текущий пароль</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showCurrentPassword ? "text" : "password"}
                                {...field}
                                className="pl-10"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Новый пароль</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showNewPassword ? "text" : "password"}
                                {...field}
                                className="pl-10"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтверждение пароля</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="******"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                className="pl-10"
                              />
                            </FormControl>
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-sm font-medium text-destructive">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm font-medium text-green-600">
                        {success}
                      </div>
                    )}
                    <Button type="submit" disabled={loadingPassword}>
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
