// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const getCategoryName = (category: string): string => {
  const categories: Record<string, string> = {
    roads: "Дороги",
    lighting: "Освещение",
    safety: "Безопасность",
    cleanliness: "Чистота",
    parks: "Парки",
    public_transport: "Общественный транспорт",
    other: "Другое",
  };

  return categories[category] || "Другое";
};

export const getStatusName = (status: string): string => {
  const statuses: Record<string, string> = {
    "to do": "К выполнению",
    progress: "В работе",
    review: "На проверке",
    done: "Выполнено",
    reject: "Отклонено",
  };

  return statuses[status] || "К выполнению";
};

export const getCityDistricts = (): {
  cities: {
    value: string;
    label: string;
    districts: { value: string; label: string }[];
  }[];
} => {
  return {
    cities: [
      {
        value: "almaty",
        label: "Алматы",
        districts: [
          { value: "almaly", label: "Алмалинский" },
          { value: "alatau", label: "Алатауский" },
          { value: "auezov", label: "Ауэзовский" },
          { value: "bostandyk", label: "Бостандыкский" },
          { value: "medeu", label: "Медеуский" },
          { value: "nauryzbay", label: "Наурызбайский" },
          { value: "turksib", label: "Турксибский" },
          { value: "jetysu", label: "Жетысуский" },
        ],
      },
      {
        value: "astana",
        label: "Астана",
        districts: [
          { value: "almaty", label: "Алматинский" },
          { value: "esil", label: "Есильский" },
          { value: "saryarka", label: "Сарыаркинский" },
          { value: "baykonur", label: "Байконурский" },
        ],
      },
      {
        value: "shymkent",
        label: "Шымкент",
        districts: [
          { value: "abay", label: "Абайский" },
          { value: "al-farabi", label: "Аль-Фарабийский" },
          { value: "enbekshi", label: "Енбекшинский" },
          { value: "karatau", label: "Каратауский" },
        ],
      },
      {
        value: "karaganda",
        label: "Караганда",
        districts: [
          { value: "kazybek-bi", label: "Казыбек би" },
          { value: "oktyabrskiy", label: "Октябрьский" },
        ],
      },
      {
        value: "aktobe",
        label: "Актобе",
        districts: [
          { value: "astana", label: "Астана" },
          { value: "aliya", label: "Алия" },
          { value: "batys", label: "Батыс" },
          { value: "eskigorod", label: "Eski-город" },
        ],
      },
    ],
  };
};

export const getStatusColor = (
  status: string
): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    "to do": { bg: "bg-gray-100", text: "text-gray-800" },
    progress: { bg: "bg-yellow-100", text: "text-yellow-800" },
    review: { bg: "bg-blue-100", text: "text-blue-800" },
    done: { bg: "bg-green-100", text: "text-green-800" },
    reject: { bg: "bg-red-100", text: "text-red-800" },
  };

  return colors[status] || colors["to do"];
};
