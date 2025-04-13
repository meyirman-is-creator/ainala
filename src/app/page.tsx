"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaExclamationTriangle,
  FaUser,
  FaCheckCircle,
  FaAngleRight,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Сообщайте о проблемах в вашем городе
                </h1>
                <p className="max-w-[600px] text-[hsl(var(--primary-foreground)/0.8)] text-sm sm:text-base md:text-lg">
                  Платформа для жителей города, позволяющая сообщать о
                  проблемах, отслеживать их решение и делать город лучше вместе.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/auth/sign-up">
                    <Button className="w-full sm:w-auto bg-[hsl(var(--background))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--background)/0.9)]">
                      Зарегистрироваться
                    </Button>
                  </Link>
                  <Link href="/issues">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground)/0.1)] hover:text-white bg-transparent"
                    >
                      Просмотр проблем
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-start mt-6 lg:mt-0">
                <div className="w-full max-w-md rounded-xl bg-[hsl(var(--primary-foreground)/0.1)] p-4 sm:p-6 backdrop-blur-sm">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 rounded-lg bg-[hsl(var(--primary-foreground)/0.2)] p-4">
                      <FaExclamationTriangle className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">
                          Сообщайте о проблемах
                        </h3>
                        <p className="text-xs sm:text-sm text-[hsl(var(--primary-foreground)/0.8)]">
                          Создавайте детальные отчеты с фотографиями
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-[hsl(var(--primary-foreground)/0.2)] p-4">
                      <FaUser className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">
                          Отслеживайте прогресс
                        </h3>
                        <p className="text-xs sm:text-sm text-[hsl(var(--primary-foreground)/0.8)]">
                          Следите за статусом решения проблем
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg bg-[hsl(var(--primary-foreground)/0.2)] p-4">
                      <FaCheckCircle className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">
                          Участвуйте в обсуждении
                        </h3>
                        <p className="text-xs sm:text-sm text-[hsl(var(--primary-foreground)/0.8)]">
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

        {/* Секция о платформе (из изображения 1) */}
        <section className="w-full py-12 md:py-16 bg-white">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-center text-gray-900 mb-8 md:mb-12">
              Платформа для решения локальных проблем в Казахстане
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  О нас
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Вместе решаем городские проблемы и улучшаем городскую среду.
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Сообщите о первой проблеме в вашем городе!
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Прекрасный город - тот, где люди счастливы...
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Что вы можете сделать для своего города?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Присоединяйтесь к решению проблем! Вместе мы можем сделать
                  наши города лучше!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Секция с пошаговым процессом (из изображения 2) */}
        <section className="w-full py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-gray-900 mb-2 sm:mb-3">
                Сообщайте о проблемах и отслеживайте их решение
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl font-light text-blue-500">
                Очень просто
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="relative">
                <div className="bg-blue-100 p-3 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 rounded-md">
                  <span className="text-base sm:text-xl font-bold">1. Шаг</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">
                  Заполните
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  форму описания проблемы и загрузите фото.
                </p>

                {/* Стрелка для планшетов и десктопа */}
                <div className="hidden lg:block absolute top-6 right-0 -mr-4 text-gray-300">
                  <FaAngleRight className="h-6 w-6 md:h-8 md:w-8" />
                </div>
              </div>

              <div className="relative">
                <div className="bg-blue-100 p-3 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 rounded-md">
                  <span className="text-base sm:text-xl font-bold">2. Шаг</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Примеры</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  проблем, о которых можно сообщить: ямы на дорогах, мусор и
                  проблемы с освещением.
                </p>

                <div className="mt-4">
                  <Button className="text-xs sm:text-sm w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 py-2 px-2 sm:px-3 w-[100%] h-auto">
                    Зарегистрироваться <br /> и добавить проблему
                  </Button>
                </div>

                {/* Стрелка для планшетов и десктопа */}
                <div className="hidden lg:block absolute top-6 right-0 -mr-4 text-gray-300">
                  <FaAngleRight className="h-6 w-6 md:h-8 md:w-8" />
                </div>
              </div>

              <div className="relative">
                <div className="bg-blue-100 p-3 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 rounded-md">
                  <span className="text-base sm:text-xl font-bold">3. Шаг</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">
                  Категории
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  проблем: дороги, электроснабжение, водоснабжение,
                  коммуникации, общественный транспорт, экология, безопасность,
                  государственные предприятия.
                </p>

                {/* Стрелка для планшетов и десктопа */}
                <div className="hidden lg:block absolute top-6 right-0 -mr-4 text-gray-300">
                  <FaAngleRight className="h-6 w-6 md:h-8 md:w-8" />
                </div>
              </div>

              <div>
                <div className="bg-blue-100 p-3 h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 rounded-md">
                  <span className="text-base sm:text-xl font-bold">4. Шаг</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">
                  Просматривайте
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  статус вашего обращения: в работе, закрыто. Статусы
                  обновляются по мере проверки и решения проблемы. Добавляйте
                  комментарии и отслеживайте прогресс решения проблемы.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-[hsl(var(--primary))]">
                Как это работает
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[hsl(var(--muted-foreground))]">
                Три простых шага для улучшения вашего города
              </p>
            </div>
            <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                  1
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-bold">
                  Создайте отчет
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Опишите проблему, загрузите фото и укажите категорию
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                  2
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-bold">
                  Отслеживайте статус
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Следите за продвижением решения проблемы
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                  3
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-bold">
                  Получите результат
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                  Увидите фотографии с результатом решения проблемы
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[hsl(var(--muted))]">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-[hsl(var(--primary))]">
                Категории проблем
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[hsl(var(--muted-foreground))]">
                Мы принимаем отчеты о различных городских проблемах
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
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
                  className="rounded-lg custom-border bg-[hsl(var(--card))] shadow-sm p-4 sm:p-6"
                >
                  <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{cat.title}</h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-[1200px] px-[15px] mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-[hsl(var(--primary))]">
                Присоединяйтесь сейчас
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[hsl(var(--muted-foreground))]">
                Вместе мы сделаем наш город лучше и комфортнее для всех!
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/sign-up">
                  <Button className="w-full sm:w-auto bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                    Зарегистрироваться
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                  >
                    Войти
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
