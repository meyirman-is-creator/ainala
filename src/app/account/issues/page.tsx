"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash, FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/store";
import { formatDate, getCategoryName, getStatusName } from "@/lib/utils";

export default function IssuesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");

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
      deadline: new Date(2023, 4, 1).toISOString(),
      assignedTo: "Дорожная служба",
      importance: "high",
      adminComment: "Проблема решена, яма заделана",
    },
    {
      id: "2",
      title: "Неработающий фонарь",
      description: "Не горит уличный фонарь на улице Гагарина, 42",
      status: "progress",
      category: "lighting",
      createdAt: new Date(2023, 4, 20).toISOString(),
      userName: "Иван Иванов",
      deadline: new Date(2023, 5, 1).toISOString(),
      assignedTo: "Служба освещения",
      importance: "medium",
    },
    {
      id: "3",
      title: "Сломанная скамейка",
      description: "Сломана скамейка в парке Горького",
      status: "to do",
      category: "parks",
      createdAt: new Date(2023, 4, 25).toISOString(),
      userName: "Иван Иванов",
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
      );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAdmin ? "Управление проблемами" : "Мои проблемы"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Просмотр и управление всеми проблемами города"
              : "Список всех созданных вами проблем и их статусы"}
          </p>
        </div>
        {!isAdmin && (
          <Link href="/account/add-issue">
            <Button>Добавить проблему</Button>
          </Link>
        )}
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск проблем..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="to do" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="to do">К выполнению</TabsTrigger>
          <TabsTrigger value="progress">В работе</TabsTrigger>
          <TabsTrigger value="done">Выполнено</TabsTrigger>
        </TabsList>

        {["to do", "progress", "done"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredIssues(status).length > 0 ? (
              filteredIssues(status).map((issue) => (
                <Card key={issue.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{issue.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">
                            {getCategoryName(issue.category)}
                          </Badge>
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
                          {issue.importance && (
                            <Badge
                              className={
                                issue.importance === "high"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : issue.importance === "medium"
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              }
                            >
                              {issue.importance === "high"
                                ? "Высокий приоритет"
                                : issue.importance === "medium"
                                ? "Средний приоритет"
                                : "Низкий приоритет"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/issues/${issue.id}`}>
                          <Button size="icon" variant="ghost">
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {!isAdmin && issue.status === "to do" && (
                          <Link href={`/account/add-issue?id=${issue.id}`}>
                            <Button size="icon" variant="ghost">
                              <FaEdit className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        {isAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="mb-4">
                      {issue.description.substring(0, 150)}
                      {issue.description.length > 150 && "..."}
                    </CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Создано:</p>
                        <p>{formatDate(issue.createdAt)}</p>
                      </div>
                      {issue.deadline && (
                        <div>
                          <p className="text-muted-foreground">Дедлайн:</p>
                          <p>{formatDate(issue.deadline)}</p>
                        </div>
                      )}
                      {issue.assignedTo && (
                        <div>
                          <p className="text-muted-foreground">
                            Ответственный:
                          </p>
                          <p>{issue.assignedTo}</p>
                        </div>
                      )}
                      {isAdmin && (
                        <div>
                          <p className="text-muted-foreground">Автор:</p>
                          <p>{issue.userName}</p>
                        </div>
                      )}
                      {issue.adminComment && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">
                            Комментарий администратора:
                          </p>
                          <p>{issue.adminComment}</p>
                        </div>
                      )}
                    </div>

                    {isAdmin && issue.status === "to do" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Принять
                        </Button>
                        <Button size="sm" variant="destructive">
                          Отклонить
                        </Button>
                      </div>
                    )}

                    {isAdmin && issue.status === "progress" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Завершить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-1">
                  Проблемы не найдены
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? `Не нашлось проблем по запросу "${searchQuery}"`
                    : `В разделе "${getStatusName(status)}" пока нет проблем`}
                </p>
                {!isAdmin && (
                  <Link href="/account/add-issue">
                    <Button>Добавить проблему</Button>
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
