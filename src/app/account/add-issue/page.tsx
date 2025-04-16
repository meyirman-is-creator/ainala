// ./src/app/account/add-issue/page.tsx
"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  FaHeading, 
  FaList, 
  FaFileUpload, 
  FaMapMarkerAlt, 
  FaCity, 
  FaAddressCard 
} from "react-icons/fa";
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

// Главный компонент страницы без использования useSearchParams
export default function AddIssuePage() {
  return (
    <div className="bg-gray-50 py-6">
      <div className="container max-w-[1200px] px-[15px] mx-auto space-y-6">
        <Suspense fallback={<IssueFormSkeleton />}>
          <IssueForm />
        </Suspense>
      </div>
    </div>
  );
}

// Компонент для отображения во время загрузки
function IssueFormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-96 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
          <div className="h-7 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-80 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="p-4 sm:p-6 pt-0">
          <div className="space-y-6 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Отдельный компонент с useSearchParams (оборачивается в Suspense)
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCityDistricts } from "@/lib/utils";

// Типизация данных для формы
const issueSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать не менее 5 символов"),
  category: z.string().min(1, "Выберите категорию"),
  description: z
    .string()
    .min(20, "Описание должно содержать не менее 20 символов"),
  city: z.string().min(1, "Выберите город"),
  district: z.string().min(1, "Выберите район"),
  address: z.string().min(5, "Укажите адрес проблемы"),
});

type FormData = z.infer<typeof issueSchema>;

// Категории (пример)
const categories = [
  { value: "roads", label: "Дороги" },
  { value: "lighting", label: "Освещение" },
  { value: "safety", label: "Безопасность" },
  { value: "cleanliness", label: "Чистота" },
  { value: "parks", label: "Парки" },
  { value: "public_transport", label: "Общественный транспорт" },
  { value: "other", label: "Другое" },
];

// Тип для массива районов
interface DistrictOption {
  value: string;
  label: string;
}

// Тип для города
interface CityOption {
  value: string;
  label: string;
  districts: DistrictOption[];
}

// Тип для общего объекта с городами/районами
interface CityDistrictsData {
  cities: CityOption[];
}

function IssueForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueId = searchParams.get("id");

  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(!!issueId);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // FIX: мемоизируем данные, чтобы при каждом ререндере не возвращался новый объект
  const cityDistrictsData: CityDistrictsData = useMemo(
    () => getCityDistricts(),
    []
  );

  // Храним доступные районы отдельно
  const [availableDistricts, setAvailableDistricts] = useState<
    DistrictOption[]
  >([]);

  // Инициализируем форму с react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      city: "",
      district: "",
      address: "",
    },
  });

  // Следим за изменением значения города
  const selectedCity = form.watch("city");

  // FIX: Убрали cityDistrictsData.cities из зависимостей, т.к. они теперь неизменны (useMemo)
  useEffect(() => {
    if (selectedCity) {
      const foundCity = cityDistrictsData.cities.find(
        (city) => city.value === selectedCity
      );
      if (foundCity) {
        setAvailableDistricts(foundCity.districts);
        // Если мы не в режиме редактирования, сбрасываем выбранный район
        if (!isEdit) {
          form.setValue("district", "");
        }
      } else {
        setAvailableDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
    }
    // Только при смене selectedCity и isEdit
  }, [selectedCity, isEdit, cityDistrictsData, form]);

  // Если у нас есть issueId, значит мы в режиме редактирования — подгружаем данные
  useEffect(() => {
    if (issueId) {
      setTimeout(() => {
        form.reset({
          title: "Яма на дороге",
          category: "roads",
          description:
            "Большая яма на пересечении улиц Ленина и Пушкина. Нужно срочно заделать.",
          city: "almaty",
          district: "almaly",
          address: "Пересечение улиц Ленина и Пушкина",
        });
        setIsEdit(true);
        // Пример заглушки — одна фотография
        setPreviewUrls([
          "https://orda.kz/uploads/posts/2024-07/sizes/1440x810/fa7420a0-93ec-4939-a8f7-09033041788f.webp",
        ]);
      }, 500);
    }
  }, [issueId, form]);

  // Отправка формы
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Собираем все данные, включая фотографии
      const submissionData = {
        ...data,
        photos,
      };

      console.log("Submitting issue:", submissionData);

      // Пример "фейкового" ожидания, будто идёт запрос на сервер
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/account/issues");
    } catch {
      setError("Ошибка при сохранении проблемы");
    } finally {
      setLoading(false);
    }
  };

  // Обработчики для фотографий
  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setPhotos(fileArray);
      // Генерируем ссылки для предварительного просмотра
      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
          {isEdit ? "Редактирование проблемы" : "Добавление проблемы"}
        </h1>
        <p className="text-gray-500">
          {isEdit
            ? "Отредактируйте информацию о проблеме"
            : "Заполните форму, чтобы сообщить о городской проблеме"}
        </p>
      </div>

      <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
            Информация о проблеме
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Подробно опишите проблему, выберите категорию и укажите
            местоположение
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-4"
            >
              {/* Заголовок */}
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
                          className="!pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
                        />
                      </FormControl>
                      <FaHeading className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    </div>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Категория */}
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
                            value={field.value}
                          >
                            <SelectTrigger className="w-full !pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FaList className="absolute left-3 top-3 h-4 w-4 text-blue-400 z-10" />
                      </div>
                      <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Город */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Город
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full !pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                              <SelectValue placeholder="Выберите город" />
                            </SelectTrigger>
                            <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                              {cityDistrictsData.cities.map((city) => (
                                <SelectItem
                                  key={city.value}
                                  value={city.value}
                                >
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FaCity className="absolute left-3 top-3 h-4 w-4 text-blue-400 z-10" />
                      </div>
                      <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Район */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Район
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedCity}
                          >
                            <SelectTrigger className="w-full !pl-10 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                              <SelectValue
                                placeholder={
                                  selectedCity
                                    ? "Выберите район"
                                    : "Сначала выберите город"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                              {availableDistricts.map((district) => (
                                <SelectItem
                                  key={district.value}
                                  value={district.value}
                                >
                                  {district.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FaMapMarkerAlt className="absolute left-3 top-3 h-4 w-4 text-blue-400 z-10" />
                      </div>
                      <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Адрес */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Адрес
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Например: ул. Ленина, 15"
                            {...field}
                            className="!pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
                          />
                        </FormControl>
                        <FaAddressCard className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                      </div>
                      <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Описание проблемы */}
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
                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium text-red-500" />
                  </FormItem>
                )}
              />

              {/* Фотографии */}
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Фотографии
                </FormLabel>
                <div
                  className="border border-dashed border-gray-300 bg-gray-50 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("photos")?.click()}
                >
                  <FaFileUpload className="h-8 w-8 text-blue-400 mb-2" />
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
                    type="button"
                  >
                    Выбрать файлы
                  </Button>
                </div>

                {/* Превью фотографий */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      Выбрано файлов: {previewUrls.length}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={url}
                            alt={`Превью ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={200}
                            height={200}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrls((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              if (photos.length > 0) {
                                setPhotos((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <FormDescription className="text-sm text-gray-500">
                  Рекомендуется приложить фотографии проблемы для лучшего
                  понимания ситуации.
                </FormDescription>
              </div>

              {/* Сообщение об ошибке */}
              {error && (
                <div className="p-3 bg-red-50 text-sm font-medium text-red-500 rounded-md">
                  {error}
                </div>
              )}

              {/* Кнопки отправки/отмены */}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border border-gray-200 bg-white hover:bg-gray-100"
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white hover:bg-blue-600"
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
    </>
  );
}