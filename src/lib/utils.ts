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
    done: "Выполнено",
    reject: "Отклонено",
  };

  return statuses[status] || "К выполнению";
};
