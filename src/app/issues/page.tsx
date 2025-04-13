"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSearch, FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
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
    },
  ]);

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

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Городские проблемы
        </h1>
        <p className="text-gray-500">
          Список проблем, о которых сообщили жители города
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск проблем..."
            className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
              <SelectValue placeholder="Все категории" />
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
        </div>
      </div>

      <Tabs defaultValue="to do" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
          <TabsTrigger
            value="to do"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
          >
            К выполнению
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
          >
            В работе
          </TabsTrigger>
          <TabsTrigger
            value="done"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
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
                    className="border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    <CardHeader className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl text-gray-900">
                            {issue.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold">
                              {getCategoryName(issue.category)}
                            </Badge>
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
                          </div>
                        </div>
                        <Link href={`/issues/${issue.id}`}>
                          <Button className="h-9 rounded-md px-3 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2">
                            <FaEye className="h-4 w-4" />
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="mb-4 text-sm text-gray-500">
                        {issue.description.substring(0, 150)}
                        {issue.description.length > 150 && "..."}
                      </CardDescription>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Создано:</p>
                          <p>{formatDate(issue.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Автор:</p>
                          <p>{issue.userName}</p>
                        </div>
                        {issue.assignedTo && (
                          <div>
                            <p className="text-gray-500">Ответственный:</p>
                            <p>{issue.assignedTo}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                          <FaThumbsUp className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {issue.likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComment className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {issue.comments}
                          </span>
                        </div>
                      </div>
                      {isAuthenticated && (
                        <Button className="h-9 rounded-md px-3 bg-transparent hover:bg-gray-100">
                          <FaThumbsUp className="h-4 w-4 mr-2" />
                          Нравится
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {totalPages(status) > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      className="h-9 rounded-md px-3 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Предыдущая
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
                              : "h-8 w-8 p-0 rounded-md border border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                          }
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      className="h-9 rounded-md px-3 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages(status), prev + 1)
                        )
                      }
                      disabled={currentPage === totalPages(status)}
                    >
                      Следующая
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">
                  Проблемы не найдены
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== "all"
                    ? "Попробуйте изменить параметры поиска"
                    : `В разделе "${getStatusName(status)}" пока нет проблем`}
                </p>
                {isAuthenticated && (
                  <Link href="/account/add-issue">
                    <Button className="h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
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
  );
}
