"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaPlusCircle,
  FaChartLine,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function AccountPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [date, setDate] = useState<Date>(new Date());

  // Исправленная функция setDate с правильным типом для календаря
  const handleDateChange = useCallback((value: Date | Date[]) => {
    // Обработка одиночной даты или диапазона дат
    if (value instanceof Date) {
      setDate(value);
    } else if (Array.isArray(value) && value.length > 0) {
      setDate(value[0]);
    }
  }, []);

  // Имитация данных проблем
  const [issues] = useState([
    {
      id: "1",
      title: "Яма на дороге",
      description: "Большая яма на пересечении улиц Ленина и Пушкина",
      status: "done",
      category: "roads",
      createdAt: new Date(2023, 3, 15).toISOString(),
    },
    {
      id: "2",
      title: "Неработающий фонарь",
      description: "Не горит уличный фонарь на улице Гагарина, 42",
      status: "progress",
      category: "lighting",
      createdAt: new Date(2023, 4, 20).toISOString(),
    },
    {
      id: "3",
      title: "Сломанная скамейка",
      description: "Сломана скамейка в парке Горького",
      status: "to do",
      category: "parks",
      createdAt: new Date(2023, 4, 25).toISOString(),
    },
  ]);

  // Фильтрация проблем по выбранной дате
  const filteredIssues = issues.filter((issue) => {
    const issueDate = new Date(issue.createdAt);
    return (
      issueDate.getDate() === date.getDate() &&
      issueDate.getMonth() === date.getMonth() &&
      issueDate.getFullYear() === date.getFullYear()
    );
  });

  // Статистика по проблемам
  const stats = {
    total: issues.length,
    done: issues.filter((issue) => issue.status === "done").length,
    inProgress: issues.filter((issue) => issue.status === "progress").length,
    todo: issues.filter((issue) => issue.status === "to do").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Добро пожаловать, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Управляйте своими городскими проблемами и отслеживайте их решение
          </p>
        </div>
        <Link href="/account/add-issue">
          <Button className="flex items-center">
            <FaPlusCircle className="mr-2" />
            Добавить проблему
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-sm font-medium">
                  Всего проблем
                </CardTitle>
                <FaChartLine className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-sm font-medium">Решено</CardTitle>
                <FaCheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{stats.done}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-sm font-medium">В работе</CardTitle>
                <FaClock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Последние проблемы</CardTitle>
              <CardDescription>
                Список ваших последних проблем для быстрого доступа
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {issues.length > 0 ? (
                <div className="space-y-4">
                  {issues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {issue.description.substring(0, 60)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(issue.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            issue.status === "done"
                              ? "bg-green-100 text-green-800"
                              : issue.status === "progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {issue.status === "done"
                            ? "Решено"
                            : issue.status === "progress"
                            ? "В работе"
                            : "К выполнению"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    У вас пока нет проблем
                  </p>
                  <Link href="/account/add-issue">
                    <Button className="mt-2">Добавить проблему</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Календарь активности</CardTitle>
            </CardHeader>
            <div className="calendar-container">
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="w-full border-none"
              />
            </div>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Проблемы за {formatDate(date)}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {filteredIssues.length > 0 ? (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {issue.description.substring(0, 40)}...
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            issue.status === "done"
                              ? "bg-green-100 text-green-800"
                              : issue.status === "progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {issue.status === "done"
                            ? "Решено"
                            : issue.status === "progress"
                            ? "В работе"
                            : "К выполнению"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Нет проблем за выбранную дату
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}