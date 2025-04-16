"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSearch,
  FaThumbsUp,
  FaComment,
  FaEye,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
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
import {
  formatDate,
  getCategoryName,
  getStatusName,
  getCityDistricts,
} from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

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
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<"from" | "to">("from");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const itemsPerPage = 5;

  const [likedIssues, setLikedIssues] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const cityDistrictsData = getCityDistricts();

  const getAvailableDistricts = () => {
    if (selectedCity === "all") {
      return [];
    }

    const cityData = cityDistrictsData.cities.find(
      (city) => city.value === selectedCity
    );
    return cityData ? cityData.districts : [];
  };

  const [issues] = useState([
    {
      id: "1",
      title: "Яма на дороге",
      description: "Большая яма на пересечении улиц Ленина и Пушкина",
      status: "progress",
      category: "roads",
      createdAt: new Date(2023, 3, 15).toISOString(),
      userName: "Иван Иванов",
      likes: 15,
      comments: 8,
      assignedTo: "Дорожная служба",
      city: "almaty",
      district: "almaly",
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
      city: "almaty",
      district: "auezov",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "3",
      title: "Сломанная скамейка",
      description: "Сломана скамейка в парке Горького",
      status: "review",
      category: "parks",
      createdAt: new Date(2023, 4, 25).toISOString(),
      userName: "Мария Сидорова",
      likes: 12,
      comments: 5,
      city: "almaty",
      district: "bostandyk",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "4",
      title: "Мусор вдоль дороги",
      description: "Скопление мусора вдоль улицы Первомайская",
      status: "progress",
      category: "cleanliness",
      createdAt: new Date(2023, 3, 8).toISOString(),
      userName: "Алексей Смирнов",
      likes: 10,
      comments: 7,
      assignedTo: "Служба уборки",
      city: "astana",
      district: "esil",
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
      city: "astana",
      district: "almaty",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "6",
      title: "Неисправный светофор",
      description: "Светофор на перекрестке Ленина и Гагарина не работает",
      status: "review",
      category: "safety",
      createdAt: new Date(2023, 5, 10).toISOString(),
      userName: "Сергей Кузнецов",
      likes: 20,
      comments: 12,
      city: "shymkent",
      district: "abay",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "7",
      title: "Отсутствие автобусного расписания",
      description: 'На остановке "Центральная" нет расписания автобусов',
      status: "progress",
      category: "public_transport",
      createdAt: new Date(2023, 2, 20).toISOString(),
      userName: "Ольга Новикова",
      likes: 6,
      comments: 4,
      assignedTo: "Транспортная служба",
      city: "karaganda",
      district: "kazybek-bi",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "8",
      title: "Плохое освещение в парке",
      description:
        "В городском парке вечером очень темно, нужны дополнительные фонари",
      status: "review",
      category: "lighting",
      createdAt: new Date(2023, 6, 5).toISOString(),
      userName: "Анна Королева",
      likes: 25,
      comments: 15,
      city: "aktobe",
      district: "aliya",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "9",
      title: "Заброшенная стройка",
      description: "Недостроенное здание на ул. Абая уже год стоит без охраны",
      status: "progress",
      category: "safety",
      createdAt: new Date(2023, 7, 12).toISOString(),
      userName: "Тимур Ахметов",
      likes: 32,
      comments: 18,
      assignedTo: "Городская администрация",
      city: "shymkent",
      district: "al-farabi",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
    {
      id: "10",
      title: "Опасный перекресток",
      description:
        "На перекрестке улиц Сатпаева и Тимирязева регулярно происходят аварии",
      status: "review",
      category: "safety",
      createdAt: new Date(2023, 8, 3).toISOString(),
      userName: "Динара Касымова",
      likes: 45,
      comments: 27,
      city: "almaty",
      district: "medeu",
      photo:
        "https://www.infpol.ru/upload/resize_cache/iblock/a7e/800_8000_1/a7e270408c44b2d442b7fe7570cc97be.jpg",
    },
  ]);

  useEffect(() => {
    const initialLikeCounts: Record<string, number> = {};
    issues.forEach((issue) => {
      initialLikeCounts[issue.id] = issue.likes;
    });
    setLikeCounts(initialLikeCounts);
  }, [issues]);

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
      )
      .filter((issue) => selectedCity === "all" || issue.city === selectedCity)
      .filter(
        (issue) =>
          selectedDistrict === "all" || issue.district === selectedDistrict
      )
      .filter((issue) => {
        if (dateFrom || dateTo) {
          const issueDate = new Date(issue.createdAt);
          const isAfterStart = dateFrom ? issueDate >= dateFrom : true;
          const isBeforeEnd = dateTo ? issueDate <= dateTo : true;
          return isAfterStart && isBeforeEnd;
        }
        return true;
      });
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

  const getCityLabel = (cityValue: string) => {
    const city = cityDistrictsData.cities.find((c) => c.value === cityValue);
    return city ? city.label : "Выберите город";
  };

  const getDistrictLabel = (districtValue: string) => {
    const districts = getAvailableDistricts();
    const district = districts.find((d) => d.value === districtValue);
    return district ? district.label : "Выберите район";
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("all");
    setCurrentPage(1);
  };

  const handleDateSelect = (date: Date) => {
    if (dateRange === "from") {
      setDateFrom(date);
      setDateRange("to");
    } else {
      setDateTo(date);
      setDateRange("from");
    }
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateRange("from");
    setCurrentPage(1);
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

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

      // Проверка, находится ли дата в выбранном диапазоне
      const isInRange =
        dateFrom &&
        dateTo &&
        dayDate >= new Date(dateFrom.setHours(0, 0, 0, 0)) &&
        dayDate <= new Date(dateTo.setHours(23, 59, 59, 999));

      // Проверка, является ли дата начальной или конечной
      const isSelectedFrom =
        dateFrom &&
        day === dateFrom.getDate() &&
        month === dateFrom.getMonth() &&
        year === dateFrom.getFullYear();

      const isSelectedTo =
        dateTo &&
        day === dateTo.getDate() &&
        month === dateTo.getMonth() &&
        year === dateTo.getFullYear();

      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(new Date(year, month, day))}
          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm ${
            isSelectedFrom
              ? "bg-blue-500 text-white font-medium"
              : isSelectedTo
              ? "bg-blue-700 text-white font-medium"
              : isInRange
              ? "bg-blue-100 text-blue-700"
              : isToday
              ? "bg-gray-100 text-blue-600 font-medium"
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

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Поиск проблем..."
              className="pl-9 h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
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
          <div>
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 h-3 w-3 text-blue-500" />
                  <SelectValue placeholder="Выберите город" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                <SelectItem
                  value="all"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs sm:text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                >
                  Все города
                </SelectItem>
                {cityDistrictsData.cities.map((city) => (
                  <SelectItem
                    key={city.value}
                    value={city.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs sm:text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                  >
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCity !== "all" && (
            <div>
              <Select
                value={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-3 w-3 text-blue-500" />
                    <SelectValue placeholder="Выберите район" />
                  </div>
                </SelectTrigger>
                <SelectContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md">
                  <SelectItem
                    value="all"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs sm:text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                  >
                    Все районы
                  </SelectItem>
                  {getAvailableDistricts().map((district) => (
                    <SelectItem
                      key={district.value}
                      value={district.value}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs sm:text-sm outline-none focus:bg-gray-100 focus:text-gray-900"
                    >
                      {district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 border border-gray-200 bg-white flex items-center gap-2"
              >
                <FaCalendarAlt className="h-3.5 w-3.5 text-blue-500" />
                {dateFrom && dateTo
                  ? `${format(dateFrom, "dd.MM.yyyy")} - ${format(
                      dateTo,
                      "dd.MM.yyyy"
                    )}`
                  : dateFrom
                  ? `От ${format(dateFrom, "dd.MM.yyyy")}`
                  : dateTo
                  ? `До ${format(dateTo, "dd.MM.yyyy")}`
                  : "Выберите период"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {dateRange === "from"
                    ? "Выберите начальную дату"
                    : "Выберите конечную дату"}
                </span>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={clearDateFilter}
                >
                  Сбросить
                </Button>
              </div>
              <div className="p-3 border-t">
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      const newDate = new Date(calendarDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCalendarDate(newDate);
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
                    }).format(calendarDate)}
                  </h3>

                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      const newDate = new Date(calendarDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCalendarDate(newDate);
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
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategory !== "all" && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex gap-1 items-center">
              Категория: {getCategoryName(selectedCategory)}
              <Button
                variant="ghost"
                className="h-4 w-4 p-0 text-blue-800 hover:bg-transparent"
                onClick={() => setSelectedCategory("all")}
              >
                ×
              </Button>
            </Badge>
          )}
          {selectedCity !== "all" && (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex gap-1 items-center">
              Город: {getCityLabel(selectedCity)}
              <Button
                variant="ghost"
                className="h-4 w-4 p-0 text-purple-800 hover:bg-transparent"
                onClick={() => {
                  setSelectedCity("all");
                  setSelectedDistrict("all");
                }}
              >
                ×
              </Button>
            </Badge>
          )}
          {selectedDistrict !== "all" && (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex gap-1 items-center">
              Район: {getDistrictLabel(selectedDistrict)}
              <Button
                variant="ghost"
                className="h-4 w-4 p-0 text-purple-800 hover:bg-transparent"
                onClick={() => setSelectedDistrict("all")}
              >
                ×
              </Button>
            </Badge>
          )}
          {(dateFrom || dateTo) && (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex gap-1 items-center">
              Период: {dateFrom ? format(dateFrom, "dd.MM.yyyy") : ""}
              {dateFrom && dateTo ? " - " : ""}
              {dateTo ? format(dateTo, "dd.MM.yyyy") : ""}
              <Button
                variant="ghost"
                className="h-4 w-4 p-0 text-orange-800 hover:bg-transparent"
                onClick={clearDateFilter}
              >
                ×
              </Button>
            </Badge>
          )}
        </div>

        <Tabs defaultValue="progress" className="w-full space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-gray-600">
            <TabsTrigger
              value="progress"
              className="text-xs sm:text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              В работе
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="text-xs sm:text-sm inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              На проверке
            </TabsTrigger>
          </TabsList>

          {["progress", "review"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {paginatedIssues(status).length > 0 ? (
                <>
                  {paginatedIssues(status).map((issue) => (
                    <Card
                      key={issue.id}
                      className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
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
                                      status === "progress"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                    }
                                  >
                                    {getStatusName(status)}
                                  </Badge>
                                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">
                                    <FaMapMarkerAlt className="mr-1 h-2 w-2" />
                                    {issue.city === "almaty"
                                      ? "Алматы"
                                      : issue.city === "astana"
                                      ? "Астана"
                                      : issue.city === "shymkent"
                                      ? "Шымкент"
                                      : issue.city === "karaganda"
                                      ? "Караганда"
                                      : issue.city === "aktobe"
                                      ? "Актобе"
                                      : issue.city}
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
                    {searchQuery ||
                    selectedCategory !== "all" ||
                    selectedCity !== "all" ||
                    selectedDistrict !== "all" ||
                    dateFrom ||
                    dateTo
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
