"use client";

import { useState } from "react";
import Link from "next/link";
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

  const filteredIssues = issues.filter((issue) => {
    const issueDate = new Date(issue.createdAt);
    return (
      issueDate.getDate() === date.getDate() &&
      issueDate.getMonth() === date.getMonth() &&
      issueDate.getFullYear() === date.getFullYear()
    );
  });

  const stats = {
    total: issues.length,
    done: issues.filter((issue) => issue.status === "done").length,
    inProgress: issues.filter((issue) => issue.status === "progress").length,
    todo: issues.filter((issue) => issue.status === "to do").length,
  };

  const hasIssueOnDate = (day: Date) => {
    return issues.some((issue) => {
      const issueDate = new Date(issue.createdAt);
      return (
        day.getDate() === issueDate.getDate() &&
        day.getMonth() === issueDate.getMonth() &&
        day.getFullYear() === issueDate.getFullYear()
      );
    });
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8 mx-auto"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const hasIssue = hasIssueOnDate(dayDate);
      const isSelected = date.getDate() === day;
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => setDate(new Date(year, month, day))}
          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm ${
            isToday
              ? "bg-blue-100 text-blue-600 font-bold"
              : isSelected
              ? "bg-blue-500 text-white"
              : hasIssue
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Добро пожаловать, {user?.name}
          </h1>
          <p className="text-gray-500">
            Управляйте своими городскими проблемами и отслеживайте их решение
          </p>
        </div>
        <Link href="/account/add-issue">
          <Button className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 rounded-md flex items-center">
            <FaPlusCircle className="mr-2" />
            Добавить проблему
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Всего проблем
                </CardTitle>
                <FaChartLine className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Решено
                </CardTitle>
                <FaCheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.done}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-white">
                <CardTitle className="text-sm font-medium text-gray-900">
                  В работе
                </CardTitle>
                <FaClock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.inProgress}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Последние проблемы
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Список ваших последних проблем для быстрого доступа
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {issues.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {issues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-base">
                          {issue.title}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
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
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="inline-flex items-center">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50">
                  <p className="text-gray-500">У вас пока нет проблем</p>
                  <Link href="/account/add-issue">
                    <Button className="mt-4 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2 rounded-md">
                      Добавить проблему
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Календарь активности
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setDate(newDate);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <h3 className="text-lg font-medium">
                  {new Intl.DateTimeFormat("ru-RU", {
                    month: "long",
                    year: "numeric",
                  }).format(date)}
                </h3>

                <button
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setDate(newDate);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                <div className="text-sm font-medium">Вс</div>
                <div className="text-sm font-medium">Пн</div>
                <div className="text-sm font-medium">Вт</div>
                <div className="text-sm font-medium">Ср</div>
                <div className="text-sm font-medium">Чт</div>
                <div className="text-sm font-medium">Пт</div>
                <div className="text-sm font-medium">Сб</div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Проблемы за {formatDate(date)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {filteredIssues.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md border border-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {issue.title}
                        </h3>
                        <p className="text-sm text-gray-500">
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
                <div className="text-center text-[15px] py-8 bg-gray-50 rounded-lg mt-4">
                  <p className="text-gray-500">Нет проблем за выбранную дату</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
