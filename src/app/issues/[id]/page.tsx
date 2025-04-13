"use client";

import { useState } from "react";
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

export default function IssueDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  // Имитация данных проблемы
  const [issue] = useState({
    id: "1",
    title: "Яма на дороге",
    description:
      "Большая яма на пересечении улиц Ленина и Пушкина. Уже несколько автомобилей получили повреждения. Требуется срочный ремонт дорожного покрытия.",
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
    photos: ["/api/placeholder/800/400", "/api/placeholder/800/400"],
    resultPhotos: ["/api/placeholder/800/400"],
    location: "Пересечение улиц Ленина и Пушкина",
    deadline: new Date(2023, 4, 1).toISOString(),
    assignedTo: "Дорожная служба",
    adminComment:
      "Проблема решена, яма заделана. Проведен ремонт дорожного покрытия.",
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // В реальном приложении здесь был бы запрос к API
    // Здесь просто очищаем поле комментария
    setComment("");
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/issues"
            className="text-sm text-primary hover:underline mb-2 inline-block"
          >
            &larr; Назад к списку проблем
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              issue.status === "done"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : issue.status === "progress"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {getStatusName(issue.status)}
          </Badge>
          <Badge variant="outline">{getCategoryName(issue.category)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Описание проблемы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="whitespace-pre-line">{issue.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <p className="text-muted-foreground">Создано:</p>
                    <p>{formatDate(issue.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-muted-foreground">Автор:</p>
                    <p>{issue.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <p className="text-muted-foreground">Местоположение:</p>
                    <p>{issue.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaTags className="text-gray-400" />
                  <div>
                    <p className="text-muted-foreground">Категория:</p>
                    <p>{getCategoryName(issue.category)}</p>
                  </div>
                </div>
                {issue.deadline && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <div>
                      <p className="text-muted-foreground">Дедлайн:</p>
                      <p>{formatDate(issue.deadline)}</p>
                    </div>
                  </div>
                )}
                {issue.assignedTo && (
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-muted-foreground">Ответственный:</p>
                      <p>{issue.assignedTo}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={liked ? "text-primary" : ""}
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                >
                  <FaThumbsUp className="mr-2 h-4 w-4" />
                  {issue.likes + (liked ? 1 : 0)}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Последнее обновление: {formatDate(issue.updatedAt)}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Фотографии проблемы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-md overflow-hidden border"
                  >
                    <Image
                      src={photo}
                      alt={`Фото проблемы ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {issue.status === "done" &&
            issue.resultPhotos &&
            issue.resultPhotos.length > 0 && (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle>Результат решения</CardTitle>
                  {issue.adminComment && (
                    <CardDescription className="whitespace-pre-line">
                      {issue.adminComment}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {issue.resultPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-md overflow-hidden border"
                      >
                        <Image
                          src={photo}
                          alt={`Фото результата ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Комментарии ({issue.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {issue.comments.length > 0 ? (
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {comment.userAvatar ? (
                          <Image
                            src={comment.userAvatar}
                            alt={comment.userName}
                            width={40}
                            height={40}
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
                          <div className="font-medium">{comment.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Пока нет комментариев
                </p>
              )}
              {isAuthenticated && (
                <>
                  <Separator className="my-4" />
                  <form onSubmit={handleCommentSubmit}>
                    <Textarea
                      placeholder="Напишите комментарий..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-2"
                    />
                    <Button type="submit" disabled={!comment.trim()}>
                      Отправить комментарий
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Прогресс решения</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Проблема создана</div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(issue.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${
                      issue.status !== "to do"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    } flex items-center justify-center`}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Принята в работу</div>
                    {issue.status !== "to do" ? (
                      <p className="text-sm text-muted-foreground">
                        {issue.assignedTo &&
                          `Ответственный: ${issue.assignedTo}`}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Ожидает рассмотрения
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${
                      issue.status === "done"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    } flex items-center justify-center`}
                  >
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Проблема решена</div>
                    {issue.status === "done" ? (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(issue.updatedAt)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        В процессе
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Похожие проблемы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <Link
                  href={`/issues/2`}
                  className="block hover:bg-gray-50 p-2 rounded-md"
                >
                  <p className="font-medium">Неработающий фонарь</p>
                  <p className="text-sm text-muted-foreground">
                    Категория: Освещение
                  </p>
                </Link>
                <Link
                  href={`/issues/3`}
                  className="block hover:bg-gray-50 p-2 rounded-md"
                >
                  <p className="font-medium">Сломанная скамейка</p>
                  <p className="text-sm text-muted-foreground">
                    Категория: Парки
                  </p>
                </Link>
                <Link
                  href={`/issues/4`}
                  className="block hover:bg-gray-50 p-2 rounded-md"
                >
                  <p className="font-medium">Мусор вдоль дороги</p>
                  <p className="text-sm text-muted-foreground">
                    Категория: Чистота
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
