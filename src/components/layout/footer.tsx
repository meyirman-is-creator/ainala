"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaTelegram,
  FaFacebook,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь был бы запрос к API
    console.log("Подписка на новости:", email);
    setEmail("");
  };

  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="max-w-[1200px] px-[15px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="text-blue-500 h-6 w-6 flex items-center justify-center rounded border border-blue-500">
                  <FaMapMarkerAlt className="h-3 w-3" />
                </div>
                <span className="text-xl font-bold text-gray-900">ГородОК</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Наша платформа помогает жителям города решать городские проблемы:
              дороги, освещение, безопасность и инфраструктуру. Мы соединяем
              граждан и власти для создания лучших городов.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} ГородОК. Все права защищены.
            </p>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Связаться с нами
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-500">
                  Шымкент, Аль-Фараби, Абдразакова 2-59
                </p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <a
                  href="mailto:gorodok@example.ru"
                  className="text-sm text-gray-500 hover:text-blue-500 break-words"
                >
                  gorodok@example.ru
                </a>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <a
                  href="tel:+77771234567"
                  className="text-sm text-gray-500 hover:text-blue-500"
                >
                  +7 777 123-45-67
                </a>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Будьте в курсе новых инициатив и городских решений.
            </p>
          </div>

          {/* Форма подписки */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Подписаться на новости
            </h3>
            <p className="text-sm text-gray-500">
              Получайте обновления о новых функциях и успешно решенных проблемах
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <Input
                type="email"
                placeholder="Введите ваш Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 w-full rounded-md border border-gray-200 bg-white min-w-0"
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Подписаться
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};
