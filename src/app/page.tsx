"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle, FaUser, FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Сообщайте о проблемах в вашем городе
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Платформа для жителей города, позволяющая сообщать о
                  проблемах, отслеживать их решение и делать город лучше вместе.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/auth/sign-up">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-gray-100"
                    >
                      Зарегистрироваться
                    </Button>
                  </Link>
                  <Link href="/issues">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Просмотр проблем
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-md rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 rounded-lg bg-white/20 p-4">
                      <FaExclamationTriangle className="h-6 w-6" />
                      <div>
                        <h3 className="font-semibold">Сообщайте о проблемах</h3>
                        <p className="text-sm text-gray-200">
                          Создавайте детальные отчеты с фотографиями
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-white/20 p-4">
                      <FaUser className="h-6 w-6" />
                      <div>
                        <h3 className="font-semibold">Отслеживайте прогресс</h3>
                        <p className="text-sm text-gray-200">
                          Следите за статусом решения проблем
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-white/20 p-4">
                      <FaCheckCircle className="h-6 w-6" />
                      <div>
                        <h3 className="font-semibold">
                          Участвуйте в обсуждении
                        </h3>
                        <p className="text-sm text-gray-200">
                          Комментируйте и оценивайте проблемы
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Как это работает
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Три простых шага для улучшения вашего города
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Создайте отчет</h3>
                <p className="mt-2 text-gray-500">
                  Опишите проблему, загрузите фото и укажите категорию
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Отслеживайте статус</h3>
                <p className="mt-2 text-gray-500">
                  Следите за продвижением решения проблемы
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Получите результат</h3>
                <p className="mt-2 text-gray-500">
                  Увидите фотографии с результатом решения проблемы
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Категории проблем
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Мы принимаем отчеты о различных городских проблемах
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "Дороги",
                  icon: "🛣️",
                  desc: "Ямы, трещины, проблемы с асфальтом",
                },
                {
                  title: "Освещение",
                  icon: "💡",
                  desc: "Неработающие фонари, темные улицы",
                },
                {
                  title: "Безопасность",
                  icon: "🔒",
                  desc: "Небезопасные участки, отсутствие разметки",
                },
                {
                  title: "Чистота",
                  icon: "🗑️",
                  desc: "Мусор, несанкционированные свалки",
                },
                {
                  title: "Парки",
                  icon: "🌳",
                  desc: "Проблемы с озеленением и парками",
                },
                {
                  title: "Транспорт",
                  icon: "🚌",
                  desc: "Проблемы с общественным транспортом",
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-white shadow-sm p-6"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-xl font-bold">{cat.title}</h3>
                  <p className="mt-2 text-gray-500">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Присоединяйтесь сейчас
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                Вместе мы сделаем наш город лучше и комфортнее для всех!
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row justify-center">
                <Link href="/auth/sign-up">
                  <Button size="lg">Зарегистрироваться</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Войти
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 sm:mb-0 text-primary">
              ГородОК
            </div>
            <div className="text-sm text-gray-500">
              © 2023-2025 ГородОК. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
