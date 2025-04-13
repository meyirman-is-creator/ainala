"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaHeading, FaList, FaFileUpload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryName } from "@/lib/utils";

const issueSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать не менее 5 символов"),
  category: z.string().min(1, "Выберите категорию"),
  description: z
    .string()
    .min(20, "Описание должно содержать не менее 20 символов"),
});

const categories = [
  { value: "roads", label: "Дороги" },
  { value: "lighting", label: "Освещение" },
  { value: "safety", label: "Безопасность" },
  { value: "cleanliness", label: "Чистота" },
  { value: "parks", label: "Парки" },
  { value: "public_transport", label: "Общественный транспорт" },
  { value: "other", label: "Другое" },
];

type FormData = z.infer<typeof issueSchema>;

export default function AddIssuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueId = searchParams.get("id");

  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(!!issueId);

  const form = useForm<FormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (issueId) {
      setTimeout(() => {
        form.reset({
          title: "Яма на дороге",
          category: "roads",
          description:
            "Большая яма на пересечении улиц Ленина и Пушкина. Нужно срочно заделать.",
        });
        setIsEdit(true);
      }, 500);
    }
  }, [issueId, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/account/issues");
    } catch (err) {
      setError("Ошибка при сохранении проблемы");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setPhotos(fileArray);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? "Редактирование проблемы" : "Добавление проблемы"}
        </h1>
        <p className="text-gray-500">
          {isEdit
            ? "Отредактируйте информацию о проблеме"
            : "Заполните форму, чтобы сообщить о городской проблеме"}
        </p>
      </div>

      <Card className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <CardTitle className="text-2xl font-semibold">
            Информация о проблеме
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Подробно опишите проблему и приложите фотографии
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Заголовок
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Например: Неработающий фонарь на улице Ленина"
                          {...field}
                          className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                        />
                      </FormControl>
                      <FaHeading className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Категория
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FaList className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    </div>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Описание
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробно опишите проблему, укажите адрес и другие важные детали"
                        {...field}
                        rows={6}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Фотографии
                </FormLabel>
                <div className="border border-gray-200 bg-white rounded-md p-6 flex flex-col items-center justify-center">
                  <FaFileUpload className="h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-center space-y-2">
                    <p>Перетащите файлы сюда или нажмите для выбора</p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG или GIF. Максимум 5 файлов.
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                    id="photos"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border border-gray-200 bg-white hover:bg-gray-100"
                    onClick={() => document.getElementById("photos")?.click()}
                    type="button"
                  >
                    Выбрать файлы
                  </Button>
                </div>
                {photos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      Выбрано файлов: {photos.length}
                    </p>
                    <ul className="text-sm text-gray-500 mt-1">
                      {photos.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <FormDescription className="text-sm text-gray-500">
                  Рекомендуется приложить фотографии проблемы для лучшего
                  понимания ситуации.
                </FormDescription>
              </div>

              {error && (
                <div className="text-sm font-medium text-red-500">{error}</div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2 h-10 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100"
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  {loading
                    ? "Сохранение..."
                    : isEdit
                    ? "Сохранить изменения"
                    : "Добавить проблему"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
