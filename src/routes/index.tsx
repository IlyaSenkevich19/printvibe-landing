import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, business } from "@/content/business";
import { faqSchema, localBusinessSchema, websiteSchema } from "@/lib/structured-data";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { TryOn } from "@/components/site/TryOn";
import { Cases } from "@/components/site/Cases";
import { Process } from "@/components/site/Process";
import { Faq } from "@/components/site/Faq";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";

const title = "Печать на футболках, кружках и наклейках в Гомеле — PrintVibe";
const description =
  "Салон печати PrintVibe в Гомеле, ул. Ефремова, 16: печать на футболках, худи, кружках, наклейках и печать фото с вашим дизайном. Поможем с макетом. Пн–Пт 10–18, Сб 10–14.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: business.name },
      { name: "geo.region", content: "BY-HO" },
      { name: "geo.placename", content: business.address.city },
      { name: "geo.position", content: `${business.geo.lat};${business.geo.lng}` },
      { name: "ICBM", content: `${business.geo.lat}, ${business.geo.lng}` },
      { "script:ld+json": localBusinessSchema() },
      { "script:ld+json": websiteSchema() },
      { "script:ld+json": faqSchema() },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <TryOn />
        <Cases />
        <Process />
        <Faq />
        <Contacts />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
