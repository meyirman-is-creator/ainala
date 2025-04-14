// src/app/issues/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Added for image support
import {
  FaSearch,
  FaThumbsUp,
  FaComment,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/lib/store";
import { formatDate, getCategoryName, getStatusName } from "@/lib/utils";

const categories = [
  { value: "all", label: "Все категории" },
  { value: "roads", label: "Дороги" },
  { value: "lighting", label: "Освещение" },
  { value: "safety", label: "Безопасность" },
  { value: "cleanliness", label: "Чистота" },
  { value: "parks", label: "Парки" },
  { value: "public_transport", label: "Общественный транспорт" },
  { value: "other", label: "Другое" },
];

export default function IssuesPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for liked issues
  const [likedIssues, setLikedIssues] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Имитация данных проблем
  const [issues] = useState([
    {
      id: "1",
      title: "Яма на дороге",
      description: "Большая яма на пересечении улиц Ленина и Пушкина",
      status: "done",
      category: "roads",
      createdAt: new Date(2023, 3, 15).toISOString(),
      userName: "Иван Иванов",
      likes: 15,
      comments: 8,
      assignedTo: "Дорожная служба",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "2",
      title: "Неработающий фонарь",
      description: "Не горит уличный фонарь на улице Гагарина, 42",
      status: "progress",
      category: "lighting",
      createdAt: new Date(2023, 4, 20).toISOString(),
      userName: "Петр Петров",
      likes: 8,
      comments: 3,
      assignedTo: "Служба освещения",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "3",
      title: "Сломанная скамейка",
      description: "Сломана скамейка в парке Горького",
      status: "to do",
      category: "parks",
      createdAt: new Date(2023, 4, 25).toISOString(),
      userName: "Мария Сидорова",
      likes: 12,
      comments: 5,
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "4",
      title: "Мусор вдоль дороги",
      description: "Скопление мусора вдоль улицы Первомайская",
      status: "done",
      category: "cleanliness",
      createdAt: new Date(2023, 3, 8).toISOString(),
      userName: "Алексей Смирнов",
      likes: 10,
      comments: 7,
      assignedTo: "Служба уборки",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "5",
      title: "Отсутствие пешеходной разметки",
      description: "Необходимо нанести пешеходную разметку возле школы №5",
      status: "progress",
      category: "safety",
      createdAt: new Date(2023, 5, 1).toISOString(),
      userName: "Екатерина Иванова",
      likes: 18,
      comments: 9,
      assignedTo: "Дорожная служба",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "6",
      title: "Неисправный светофор",
      description: "Светофор на перекрестке Ленина и Гагарина не работает",
      status: "to do",
      category: "safety",
      createdAt: new Date(2023, 5, 10).toISOString(),
      userName: "Сергей Кузнецов",
      likes: 20,
      comments: 12,
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "7",
      title: "Отсутствие автобусного расписания",
      description: 'На остановке "Центральная" нет расписания автобусов',
      status: "done",
      category: "public_transport",
      createdAt: new Date(2023, 2, 20).toISOString(),
      userName: "Ольга Новикова",
      likes: 6,
      comments: 4,
      assignedTo: "Транспортная служба",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
  ]);

  // Initialize like counts
  useState(() => {
    const initialLikeCounts: Record<string, number> = {};
    issues.forEach((issue) => {
      initialLikeCounts[issue.id] = issue.likes;
    });
    setLikeCounts(initialLikeCounts);
  });

  const filteredIssues = (status: string) => {
    return issues
      .filter((issue) => issue.status === status)
      .filter(
        (issue) =>
          searchQuery === "" ||
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(
        (issue) =>
          selectedCategory === "all" || issue.category === selectedCategory
      );
  };

  const paginatedIssues = (status: string) => {
    const filtered = filteredIssues(status);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (status: string) => {
    return Math.ceil(filteredIssues(status).length / itemsPerPage);
  };

  const handleLike = (issueId: string) => {
    if (!isAuthenticated) return;

    setLikedIssues((prev) => ({
      ...prev,
      [issueId]: !prev[issueId],
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [issueId]: prev[issueId] + (likedIssues[issueId] ? -1 : 1),
    }));
  };

  return (
    <div className="w-full py-6 sm:py-8">
      <div className="max-w-[1200px] px-[15px] mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Городские проблемы
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Список проблем, о которых сообщили жители города
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Поиск проблем..."
              className="!pl-[35px] h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm">
                <div className="flex items-center">
                  <FaFilter className="mr-2 h-3 w-3 text-blue-500" />
                  <SelectValue placeholder="Все категории" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs sm:text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="to do" className="w-full space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-9 sm:h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-gray-600">
            <TabsTrigger
              value="to do"
              className="text-xs sm:text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              К выполнению
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-xs sm:text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              В работе
            </TabsTrigger>
            <TabsTrigger
              value="done"
              className="text-xs sm:text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Выполнено
            </TabsTrigger>
          </TabsList>

          {["to do", "progress", "done"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {paginatedIssues(status).length > 0 ? (
                <>
                  {paginatedIssues(status).map((issue) => (
                    <Card
                      key={issue.id}
                      className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Added photo column */}
                        <div className="w-full md:w-1/3 relative min-h-[160px]">
                          <Image
                            src={issue.photo}
                            alt={issue.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="w-full md:w-2/3">
                          <CardHeader className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 line-clamp-2">
                                  {issue.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5">
                                  <Badge className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs font-semibold">
                                    {getCategoryName(issue.category)}
                                  </Badge>
                                  <Badge
                                    className={
                                      issue.status === "done"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                        : issue.status === "progress"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                    }
                                  >
                                    {getStatusName(issue.status)}
                                  </Badge>
                                </div>
                              </div>
                              <Link
                                href={`/issues/${issue.id}`}
                                className="w-full sm:w-auto mt-2 sm:mt-0"
                              >
                                <Button className="w-full sm:w-auto h-8 sm:h-9 rounded-md px-2 sm:px-3 border border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5">
                                  <FaEye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="text-xs sm:text-sm">
                                    Подробнее
                                  </span>
                                </Button>
                              </Link>
                            </div>
                          </CardHeader>
                          <CardContent className="px-3 sm:px-4 py-0">
                            <CardDescription className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 line-clamp-2">
                              {issue.description.substring(0, 150)}
                              {issue.description.length > 150 && "..."}
                            </CardDescription>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <p className="text-gray-500">Создано:</p>
                                <p className="font-medium">
                                  {formatDate(issue.createdAt)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Автор:</p>
                                <p className="font-medium">{issue.userName}</p>
                              </div>
                              {issue.assignedTo && (
                                <div>
                                  <p className="text-gray-500">
                                    Ответственный:
                                  </p>
                                  <p className="font-medium">
                                    {issue.assignedTo}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-gray-100 mt-3">
                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="flex items-center gap-1.5">
                                <FaThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                  {likeCounts[issue.id] || issue.likes}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <FaComment className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                  {issue.comments}
                                </span>
                              </div>
                            </div>
                            {isAuthenticated && (
                              <Button
                                className={`w-full sm:w-auto h-8 rounded-md px-3 ${
                                  likedIssues[issue.id]
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                }`}
                                onClick={() => handleLike(issue.id)}
                              >
                                <FaThumbsUp className="h-3 w-3 mr-1.5" />
                                <span className="text-xs">
                                  {likedIssues[issue.id]
                                    ? "Нравится"
                                    : "Нравится"}
                                </span>
                              </Button>
                            )}
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {totalPages(status) > 1 && (
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                      <Button
                        className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Назад
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages(status) },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            className={
                              currentPage === page
                                ? "h-8 w-8 p-0 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                : "h-8 w-8 p-0 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                            }
                            onClick={() => setCurrentPage(page)}
                          >
                            <span className="text-xs">{page}</span>
                          </Button>
                        ))}
                      </div>
                      <Button
                        className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages(status), prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages(status)}
                      >
                        Далее
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                  <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900">
                    Проблемы не найдены
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Попробуйте изменить параметры поиска"
                      : `В разделе "${getStatusName(status)}" пока нет проблем`}
                  </p>
                  {isAuthenticated && (
                    <Link href="/account/add-issue">
                      <Button className="h-9 sm:h-10 px-3 sm:px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 text-xs sm:text-sm">
                        Добавить проблему
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
