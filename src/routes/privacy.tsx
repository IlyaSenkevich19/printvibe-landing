import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SITE_URL, business, fullAddress } from "@/content/business";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const title = "Политика конфиденциальности — PrintVibe";
const description =
  "Как салон печати PrintVibe (Гомель) обрабатывает персональные данные клиентов и посетителей сайта.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: Privacy,
});

const revision = "6 октября 2026 г.";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl leading-tight md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-ink/80 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

function Privacy() {
  const operator = business.legal.name
    ? `${business.legal.name}${business.legal.unp ? `, УНП ${business.legal.unp}` : ""}`
    : `владелец салона печати ${business.name}`;

  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <Link to="/" className="eyebrow text-violet hover:underline">
          ← На главную
        </Link>
        <h1 className="mt-6 font-display text-4xl leading-none md:text-6xl">
          Политика конфиденциальности
        </h1>
        <p className="mt-6 text-ink/60">Редакция от {revision}</p>

        <Section title="1. Общие положения">
          <p>
            Настоящая политика определяет, как {operator} (далее — оператор) обрабатывает
            персональные данные в соответствии с Законом Республики Беларусь от 7 мая 2021 г. № 99-З
            «О защите персональных данных».
          </p>
          <p>
            Адрес оператора: {fullAddress}. Телефон: {business.phone.display}.
          </p>
        </Section>

        <Section title="2. Какие данные мы обрабатываем и зачем">
          <p>Сайт не содержит форм и не собирает персональные данные напрямую.</p>
          <p>
            Изображения, которые вы загружаете в «Примерочную», обрабатываются только в вашем
            браузере и не передаются на сервер.
          </p>
          <p>
            Когда вы обращаетесь к нам по телефону, в Telegram или Instagram, мы обрабатываем
            данные, которые вы сообщаете сами:
          </p>
          <ul>
            <li>имя, номер телефона, имя пользователя в мессенджере;</li>
            <li>содержание переписки и детали заказа;</li>
            <li>изображения и макеты, которые вы присылаете для печати.</li>
          </ul>
          <p>
            Эти данные используются только для того, чтобы ответить на ваш запрос, согласовать,
            выполнить и выдать заказ. Присылая изображения с другими людьми, вы подтверждаете, что
            вправе их использовать.
          </p>
        </Section>

        <Section title="3. Технические данные и cookies">
          <p>
            Сайт не использует собственные cookie-файлы и сервисы веб-аналитики. Шрифты и
            изображения загружаются с того же сервера, что и сайт.
          </p>
          <p>
            Хостинг-провайдер может автоматически записывать технические сведения о запросах
            (IP-адрес, тип браузера, время обращения) для обеспечения работы и безопасности сайта.
          </p>
          <p>
            Карта в разделе «Контакты» загружается с сервиса Яндекс Карты только после нажатия
            кнопки «Показать карту». После этого ООО «Яндекс» может обрабатывать ваши данные и
            устанавливать cookie-файлы в соответствии со своей политикой конфиденциальности.
          </p>
        </Section>

        <Section title="4. Передача третьим лицам">
          <p>
            Мы не передаём ваши данные третьим лицам, кроме случаев, предусмотренных
            законодательством Республики Беларусь.
          </p>
          <p>
            Переписка в Telegram и Instagram обрабатывается также операторами этих сервисов, в том
            числе за пределами Республики Беларусь, по их собственным правилам.
          </p>
        </Section>

        <Section title="5. Сроки хранения">
          <p>
            Данные хранятся в течение времени, необходимого для выполнения заказа, а также в сроки,
            установленные законодательством (например, для бухгалтерского учёта). Затем они
            удаляются.
          </p>
        </Section>

        <Section title="6. Ваши права">
          <p>Вы вправе:</p>
          <ul>
            <li>получить информацию об обработке ваших персональных данных;</li>
            <li>потребовать изменить данные, если они неполные, устаревшие или неточные;</li>
            <li>отозвать согласие на обработку, если обработка основана на согласии;</li>
            <li>потребовать прекратить обработку и удалить данные;</li>
            <li>получать информацию о предоставлении ваших данных третьим лицам;</li>
            <li>
              обжаловать действия оператора в Национальный центр защиты персональных данных
              Республики Беларусь.
            </li>
          </ul>
          <p>
            Для этого направьте заявление в письменной форме по адресу {fullAddress} или в виде
            электронного документа. Мы ответим в сроки, установленные законом.
          </p>
        </Section>

        <Section title="7. Изменения политики">
          <p>
            Оператор может обновлять эту политику. Актуальная редакция всегда доступна на этой
            странице.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
