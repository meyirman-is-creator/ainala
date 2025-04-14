// src/app/account/issues/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaUser,
  FaClock,
  FaList,
  FaExclamationTriangle,
  FaPaperclip,
} from "react-icons/fa";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function IssuesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<any>(null);
  const [issueToReject, setIssueToReject] = useState<any>(null);
  const [issueToView, setIssueToView] = useState<any>(null);

  // Accept Modal State
  const [responsiblePerson, setResponsiblePerson] = useState("Tender");
  const [dueDate, setDueDate] = useState("Today");
  const [status, setStatus] = useState("In Progress");
  const [importance, setImportance] = useState("Medium");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Complete Modal State
  const [completeComment, setCompleteComment] = useState("");
  const [resultPhotos, setResultPhotos] = useState<File[]>([]);
  const [resultPreviewUrls, setResultPreviewUrls] = useState<string[]>([]);

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
      photo:
        "https://sun9-65.userapi.com/s/v1/if2/nttySWpyrJxho8BV4vOBi4Se_XTHEZJt2QTcTRXHiQH04jdoZBoopRNwDgKdgJ00SIpvAi93APbZZpIMZT8CKTI1.jpg?quality=96&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,442x442&from=bu&u=orFgsJiOsLFnnncES6c-NzoYx7DkF56--_Rg871rF3k&cs=442x442",
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
      photo:
        "https://sun9-65.userapi.com/s/v1/if2/nttySWpyrJxho8BV4vOBi4Se_XTHEZJt2QTcTRXHiQH04jdoZBoopRNwDgKdgJ00SIpvAi93APbZZpIMZT8CKTI1.jpg?quality=96&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,442x442&from=bu&u=orFgsJiOsLFnnncES6c-NzoYx7DkF56--_Rg871rF3k&cs=442x442",
    },
    {
      id: "3",
      title: "Сломанная скамейка",
      description: "Сломана скамейка в парке Горького",
      status: "to do",
      category: "parks",
      createdAt: new Date(2023, 4, 25).toISOString(),
      userName: "Иван Иванов",
      photo:
        "https://sun9-65.userapi.com/s/v1/if2/nttySWpyrJxho8BV4vOBi4Se_XTHEZJt2QTcTRXHiQH04jdoZBoopRNwDgKdgJ00SIpvAi93APbZZpIMZT8CKTI1.jpg?quality=96&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,442x442&from=bu&u=orFgsJiOsLFnnncES6c-NzoYx7DkF56--_Rg871rF3k&cs=442x442",
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

  const handleAcceptIssue = (issue: any) => {
    setSelectedIssue(issue);
    setIsAcceptModalOpen(true);
    setResponsiblePerson("Tender");
    setDueDate("Today");
    setStatus("In Progress");
    setImportance("Medium");
    setAttachments([]);
  };

  const handleCompleteIssue = (issue: any) => {
    setSelectedIssue(issue);
    setIsCompleteModalOpen(true);
    setCompleteComment("");
    setResultPhotos([]);
    setResultPreviewUrls([]);
  };

  const handleAcceptSubmit = () => {
    console.log("Accepting issue:", {
      issueId: selectedIssue?.id,
      responsiblePerson,
      dueDate,
      status,
      importance,
      attachments,
    });
    setIsAcceptModalOpen(false);
  };

  const handleCompleteSubmit = () => {
    console.log("Completing issue:", {
      issueId: selectedIssue?.id,
      comment: completeComment,
      photos: resultPhotos,
    });
    setIsCompleteModalOpen(false);
  };

  const handleResultPhotoChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setResultPhotos(fileArray);

      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setResultPreviewUrls(newPreviewUrls);
    }
  };

  const handleAttachmentChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(fileArray);
    }
  };

  return (
    <div className="bg-gray-50 py-6 ">
      <div className="container max-w-[1200px] px-[15px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {isAdmin ? "Управление проблемами" : "Мои проблемы"}
            </h1>
            <p className="text-gray-500">
              {isAdmin
                ? "Просмотр и управление всеми проблемами города"
                : "Список всех созданных вами проблем и их статусы"}
            </p>
          </div>
          {!isAdmin && (
            <Link href="/account/add-issue">
              <Button className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600">
                Добавить проблему
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Поиск проблем..."
              className="!pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="to do" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
            <TabsTrigger
              value="to do"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              К выполнению
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              В работе
            </TabsTrigger>
            <TabsTrigger
              value="done"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Выполнено
            </TabsTrigger>
          </TabsList>

          {["to do", "progress", "done"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filteredIssues(status).length > 0 ? (
                filteredIssues(status).map((issue) => (
                  <Card
                    key={issue.id}
                    className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl text-gray-900">
                            {issue.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="border rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            >
                              {getCategoryName(issue.category)}
                            </Badge>
                            <Badge
                              className={
                                issue.status === "done"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                  : issue.status === "progress"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              }
                            >
                              {getStatusName(issue.status)}
                            </Badge>
                            {issue.importance && (
                              <Badge
                                className={
                                  issue.importance === "high"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    : issue.importance === "medium"
                                    ? "bg-orange-100 text-orange-800 hover:bg-orange-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
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
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-md hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => {
                              setIssueToView(issue);
                              setViewModalOpen(true);
                            }}
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>
                          {!isAdmin && issue.status === "to do" && (
                            <Link href={`/account/add-issue?id=${issue.id}`}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 rounded-md hover:bg-blue-50 hover:text-blue-600"
                              >
                                <FaEdit className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          {isAdmin && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 h-10 w-10 rounded-md hover:bg-red-50"
                              onClick={() => {
                                setIssueToDelete(issue);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardDescription className="mb-4 text-sm text-gray-500">
                        {issue.description.substring(0, 150)}
                        {issue.description.length > 150 && "..."}
                      </CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Создано:</p>
                          <p className="font-medium">
                            {formatDate(issue.createdAt)}
                          </p>
                        </div>
                        {issue.deadline && (
                          <div>
                            <p className="text-gray-500">Дедлайн:</p>
                            <p className="font-medium">
                              {formatDate(issue.deadline)}
                            </p>
                          </div>
                        )}
                        {issue.assignedTo && (
                          <div>
                            <p className="text-gray-500">Ответственный:</p>
                            <p className="font-medium">{issue.assignedTo}</p>
                          </div>
                        )}
                        {isAdmin && (
                          <div>
                            <p className="text-gray-500">Автор:</p>
                            <p className="font-medium">{issue.userName}</p>
                          </div>
                        )}
                        {issue.adminComment && (
                          <div className="md:col-span-2 mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-gray-500 font-medium">
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
                            className="bg-green-600 hover:bg-green-700 text-white h-9 rounded-md px-3"
                            onClick={() => handleAcceptIssue(issue)}
                          >
                            Принять
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600 h-9 rounded-md px-3"
                            onClick={() => {
                              setIssueToReject(issue);
                              setRejectModalOpen(true);
                            }}
                          >
                            Отклонить
                          </Button>
                        </div>
                      )}

                      {isAdmin && issue.status === "progress" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-9 rounded-md px-3"
                            onClick={() => handleCompleteIssue(issue)}
                          >
                            Завершить
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-1 text-gray-900">
                    Проблемы не найдены
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? `Не нашлось проблем по запросу "${searchQuery}"`
                      : `В разделе "${getStatusName(status)}" пока нет проблем`}
                  </p>
                  {!isAdmin && (
                    <Link href="/account/add-issue">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
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

      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg p-0 rounded-lg overflow-hidden shadow-lg">
          <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-white">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Управление статусом проблемы
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-blue-500">
                <FaUser className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-2 text-gray-700">Ответственный</p>
                <Select
                  value={responsiblePerson}
                  onValueChange={setResponsiblePerson}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10">
                    <SelectValue placeholder="Выберите ответственного" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tender">Tender</SelectItem>
                    <SelectItem value="Дорожная служба">
                      Дорожная служба
                    </SelectItem>
                    <SelectItem value="Служба освещения">
                      Служба освещения
                    </SelectItem>
                    <SelectItem value="Служба уборки">Служба уборки</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-blue-500">
                <FaClock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-2 text-gray-700">
                  Срок выполнения
                </p>
                <Select value={dueDate} onValueChange={setDueDate}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10">
                    <SelectValue placeholder="Выберите срок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Today">Сегодня</SelectItem>
                    <SelectItem value="Tomorrow">Завтра</SelectItem>
                    <SelectItem value="Next week">Следующая неделя</SelectItem>
                    <SelectItem value="Custom">Выбрать дату</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-blue-500">
                <FaList className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-2 text-gray-700">Статус</p>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">К выполнению</SelectItem>
                    <SelectItem value="In Progress">В работе</SelectItem>
                    <SelectItem value="Done">Выполнено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-blue-500">
                <FaExclamationTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-2 text-gray-700">
                  Уровень важности
                </p>
                <Select value={importance} onValueChange={setImportance}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10">
                    <SelectValue placeholder="Выберите важность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Низкий</SelectItem>
                    <SelectItem value="Medium">Средний</SelectItem>
                    <SelectItem value="High">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-4 text-lg text-gray-900">
                Прикрепленные файлы
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FaPaperclip className="h-5 w-5 mr-2" />
                  <span>Нет прикрепленных файлов</span>
                </div>
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button
                      variant="secondary"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Прикрепить файл
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleAttachmentChange(e.target.files)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 border-t flex justify-end">
            <Button
              onClick={handleAcceptSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
        <DialogContent className="sm:max-w-md lg:max-w-lg p-0 rounded-lg overflow-hidden shadow-lg">
          <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-white">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Завершение проблемы
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                {selectedIssue?.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedIssue?.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700">
                  Добавьте фото результата решения
                </Label>
                <div
                  className="border border-dashed border-gray-300 bg-gray-50 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    document.getElementById("result-photos")?.click()
                  }
                >
                  <svg
                    className="h-10 w-10 text-blue-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-sm text-center space-y-2">
                    <p className="font-medium text-gray-700">
                      Перетащите файлы сюда или нажмите для выбора
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG или GIF. Максимум 5 файлов.
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={(e) => handleResultPhotoChange(e.target.files)}
                    id="result-photos"
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

                {resultPreviewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-gray-700">
                      Выбрано файлов: {resultPreviewUrls.length}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {resultPreviewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border border-gray-200 shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Превью ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResultPreviewUrls((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              setResultPhotos((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2 text-gray-700">
                  Комментарий о решении
                </Label>
                <Textarea
                  placeholder="Опишите, как была решена проблема"
                  value={completeComment}
                  onChange={(e) => setCompleteComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCompleteModalOpen(false)}
              className="border border-gray-200 bg-white hover:bg-gray-100"
            >
              Отмена
            </Button>
            <Button
              onClick={handleCompleteSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={resultPreviewUrls.length === 0}
            >
              Завершить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-4xl p-0 rounded-lg overflow-hidden shadow-lg">
          <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-white">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {issueToView?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Описание</h3>
                  <p className="text-gray-700">{issueToView?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Создано:</p>
                    <p className="font-medium">
                      {issueToView && formatDate(issueToView.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Категория:</p>
                    <p className="font-medium">
                      {issueToView && getCategoryName(issueToView.category)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Статус:</p>
                    <p className="font-medium">
                      {issueToView && getStatusName(issueToView.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Автор:</p>
                    <p className="font-medium">{issueToView?.userName}</p>
                  </div>
                  {issueToView?.assignedTo && (
                    <div>
                      <p className="text-gray-500">Ответственный:</p>
                      <p className="font-medium">{issueToView.assignedTo}</p>
                    </div>
                  )}
                  {issueToView?.deadline && (
                    <div>
                      <p className="text-gray-500">Дедлайн:</p>
                      <p className="font-medium">
                        {formatDate(issueToView.deadline)}
                      </p>
                    </div>
                  )}
                </div>

                {issueToView?.adminComment && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Комментарий администратора
                    </h3>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p>{issueToView.adminComment}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Фотографии</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src="https://sun9-65.userapi.com/s/v1/if2/nttySWpyrJxho8BV4vOBi4Se_XTHEZJt2QTcTRXHiQH04jdoZBoopRNwDgKdgJ00SIpvAi93APbZZpIMZT8CKTI1.jpg?quality=96&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,442x442&from=bu&u=orFgsJiOsLFnnncES6c-NzoYx7DkF56--_Rg871rF3k&cs=442x442"
                      alt="Фотография проблемы"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  {issueToView?.status === "done" && (
                    <>
                      <h3 className="text-lg font-semibold mb-2">
                        Результат решения
                      </h3>
                      <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src="https://auto-dor.com.ua/wp-content/uploads/2019/11/remont-dorog.jpg"
                          alt="Результат решения проблемы"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 border-t flex justify-end">
            <Button
              onClick={() => setViewModalOpen(false)}
              className="border border-gray-200 !bg-blue"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены, что хотите удалить?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Проблема "{issueToDelete?.title}"
              будет навсегда удалена из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                console.log("Удаление проблемы:", issueToDelete?.id);
                setDeleteModalOpen(false);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отклонить проблему?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь отклонить проблему "{issueToReject?.title}".
              Пожалуйста, убедитесь, что указали причину отказа.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-4">
            <Label htmlFor="reject-reason">Причина отклонения</Label>
            <Textarea
              id="reject-reason"
              placeholder="Укажите причину отклонения проблемы"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                console.log("Отклонение проблемы:", issueToReject?.id);
                setRejectModalOpen(false);
              }}
            >
              Отклонить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
