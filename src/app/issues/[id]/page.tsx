"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaThumbsUp,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaTags,
  FaClock,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/store";
import { formatDate, getCategoryName, getStatusName } from "@/lib/utils";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function IssueDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(15);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Имитация данных проблемы
  const [issue] = useState({
    id: "1",
    title: "Яма на дороге",
    description:
      "Большая яма на пересечении улиц Ленина и Пушкина. Уже несколько автомобилей получили повреждения. Требуется срочный ремонт дорожного покрытия. Проблема существует с прошлого месяца и становится все более опасной, особенно в темное время суток.",
    status: "done",
    category: "roads",
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 4, 1).toISOString(),
    userName: "Иван Иванов",
    userId: "123",
    likes: 15,
    comments: [
      {
        id: "1",
        userName: "Петр Петров",
        userAvatar: "",
        content:
          "Да, там действительно большая яма. Нужно срочно решать эту проблему!",
        createdAt: new Date(2023, 3, 16).toISOString(),
      },
      {
        id: "2",
        userName: "Мария Сидорова",
        userAvatar: "",
        content: "Я тоже повредила колесо на этой яме. Надеюсь, скоро починят.",
        createdAt: new Date(2023, 3, 18).toISOString(),
      },
      {
        id: "3",
        userName: "Администратор",
        userAvatar: "",
        content:
          "Проблема принята в работу. Бригада дорожников направлена для устранения.",
        createdAt: new Date(2023, 3, 20).toISOString(),
      },
      {
        id: "4",
        userName: "Администратор",
        userAvatar: "",
        content: "Проблема решена. Яма заделана.",
        createdAt: new Date(2023, 4, 1).toISOString(),
      },
    ],
    photos: [
      "https://orda.kz/uploads/posts/2024-07/sizes/1440x810/fa7420a0-93ec-4939-a8f7-09033041788f.webp",
      "https://auto-dor.com.ua/wp-content/uploads/2019/11/yamy-na-doroge.jpg",
    ],
    resultPhotos: [
      "https://auto-dor.com.ua/wp-content/uploads/2019/11/remont-dorog.jpg",
    ],
    location: {
      lat: 43.238949,
      lng: 76.889709,
    },
    address: "Пересечение улиц Ленина и Пушкина",
    deadline: new Date(2023, 4, 1).toISOString(),
    assignedTo: "Дорожная служба",
    adminComment:
      "Проблема решена, яма заделана. Проведен ремонт дорожного покрытия и нанесена разметка для предотвращения аварийных ситуаций.",
  });

  useEffect(() => {
    if (!mapInitialized && issue.location && typeof window !== "undefined") {
      const mapContainer = document.getElementById("map");

      if (mapContainer) {
        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [issue.location.lng, issue.location.lat],
          zoom: 14,
        });

        map.on("load", () => {
          // Add marker
          new mapboxgl.Marker()
            .setLngLat([issue.location.lng, issue.location.lat])
            .addTo(map);

          setMapInitialized(true);
        });
      }
    }
  }, [issue.location, mapInitialized]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // В реальном приложении здесь был бы запрос к API
    // Здесь просто очищаем поле комментария
    setComment("");
  };

  const handleLike = () => {
    if (!isAuthenticated) return;

    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container max-w-[1200px] px-[15px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/issues"
              className="text-sm text-blue-600 hover:underline mb-2 inline-flex items-center gap-1"
            >
              <span>⟵</span> Назад к списку проблем
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              {issue.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                issue.status === "done"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  : issue.status === "progress"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              }
            >
              {getStatusName(issue.status)}
            </Badge>
            <Badge className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold">
              {getCategoryName(issue.category)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Описание проблемы
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="whitespace-pre-line text-gray-700 mt-4">
                  {issue.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <div>
                      <p className="text-gray-500">Создано:</p>
                      <p className="font-medium">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    <div>
                      <p className="text-gray-500">Автор:</p>
                      <p className="font-medium">{issue.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <div>
                      <p className="text-gray-500">Местоположение:</p>
                      <p className="font-medium">{issue.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTags className="text-blue-500" />
                    <div>
                      <p className="text-gray-500">Категория:</p>
                      <p className="font-medium">
                        {getCategoryName(issue.category)}
                      </p>
                    </div>
                  </div>
                  {issue.deadline && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      <div>
                        <p className="text-gray-500">Дедлайн:</p>
                        <p className="font-medium">
                          {formatDate(issue.deadline)}
                        </p>
                      </div>
                    </div>
                  )}
                  {issue.assignedTo && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      <div>
                        <p className="text-gray-500">Ответственный:</p>
                        <p className="font-medium">{issue.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0 flex items-center justify-between bg-gray-50 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    className={`h-9 rounded-md px-3 flex items-center gap-2 ${
                      liked
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "border-blue-200 text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={handleLike}
                    disabled={!isAuthenticated}
                  >
                    <FaThumbsUp className="h-4 w-4" />
                    <span>{likeCount}</span>
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-400 ml-2">
                      Войдите, чтобы поставить лайк
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Последнее обновление: {formatDate(issue.updatedAt)}
                </div>
              </CardFooter>
            </Card>

            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Фотографии проблемы
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {issue.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <Image
                        src={photo}
                        alt={`Фото проблемы ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Местоположение
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div
                  id="map"
                  className="w-full h-64 mt-4 rounded-md border border-gray-200"
                ></div>
                <p className="text-sm text-gray-500 mt-2">
                  Адрес: {issue.address}
                </p>
              </CardContent>
            </Card>

            {issue.status === "done" &&
              issue.resultPhotos &&
              issue.resultPhotos.length > 0 && (
                <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-white">
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-green-500">✓</span> Результат
                      решения
                    </CardTitle>
                    {issue.adminComment && (
                      <CardDescription className="whitespace-pre-line text-sm text-gray-500 mt-2">
                        {issue.adminComment}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {issue.resultPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-md overflow-hidden border border-gray-200 shadow-sm"
                        >
                          <Image
                            src={photo}
                            alt={`Фото проблемы ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Комментарии ({issue.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {issue.comments.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {issue.comments.map((comment, index) => (
                      <div
                        key={comment.id}
                        className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                          {comment.userAvatar ? (
                            <Image
                              src={comment.userAvatar}
                              alt={comment.userName}
                              width={40}
                              height={40}
                              unoptimized
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-lg font-bold">
                              {comment.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">
                              {comment.userName === "Администратор" ? (
                                <span className="text-blue-600">
                                  {comment.userName}
                                </span>
                              ) : (
                                comment.userName
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                          <p className="mt-1 text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg mt-4">
                    Пока нет комментариев
                  </p>
                )}
                {isAuthenticated && (
                  <>
                    <Separator className="h-px bg-gray-200 my-6" />
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Добавить комментарий
                      </h4>
                      <Textarea
                        placeholder="Напишите комментарий..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-3 min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
                      />
                      <Button
                        type="submit"
                        disabled={!comment.trim()}
                        className="h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Отправить комментарий
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden sticky top-20">
              <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Прогресс решения
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4 relative mt-4 pl-4 before:absolute before:top-0 before:bottom-4 before:left-4 before:w-0.5 before:bg-gray-200">
                  <div className="flex gap-3 relative">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white absolute -left-4 z-10">
                      1
                    </div>
                    <div className="flex-1 ml-6 pb-4">
                      <div className="font-medium text-gray-900">
                        Проблема создана
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 relative">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${
                        issue.status !== "to do"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      } flex items-center justify-center absolute -left-4 z-10`}
                    >
                      2
                    </div>
                    <div className="flex-1 ml-6 pb-4">
                      <div className="font-medium text-gray-900">
                        Принята в работу
                      </div>
                      {issue.status !== "to do" ? (
                        <p className="text-sm text-gray-500">
                          {issue.assignedTo &&
                            `Ответственный: ${issue.assignedTo}`}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Ожидает рассмотрения
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 relative">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${
                        issue.status === "done"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      } flex items-center justify-center absolute -left-4 z-10`}
                    >
                      3
                    </div>
                    <div className="flex-1 ml-6">
                      <div className="font-medium text-gray-900">
                        Проблема решена
                      </div>
                      {issue.status === "done" ? (
                        <p className="text-sm text-gray-500">
                          {formatDate(issue.updatedAt)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">В процессе</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
