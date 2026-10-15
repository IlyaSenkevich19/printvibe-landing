import { SITE_URL, business, faq, hours, services } from "@/content/business";

const businessId = `${SITE_URL}/#business`;

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId,
    name: business.title,
    alternateName: business.name,
    description:
      "Салон печати в Гомеле: печать на футболках, худи и свитшотах, кружках и печать фотографий с вашим дизайном.",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/og-image.jpg`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: business.phone.e164,
    email: business.email.address,
    ...(business.legal.name && { legalName: business.legal.name }),
    ...(business.legal.unp && { taxID: business.legal.unp }),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.street}, ${business.address.floor}`,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    hasMap: `https://yandex.by/maps/?pt=${business.geo.lng},${business.geo.lat}&z=17`,
    areaServed: { "@type": "City", name: business.address.city },
    openingHoursSpecification: hours
      .filter((d) => d.open && d.close)
      .map((d) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${d.schemaDay}`,
        opens: d.open,
        closes: d.close,
      })),
    sameAs: [business.instagram.url, business.telegram.url],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phone.e164,
      email: business.email.address,
      contactType: "customer service",
      availableLanguage: ["ru", "be"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги печати",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.text,
          areaServed: { "@type": "City", name: business.address.city },
          provider: { "@id": businessId },
        },
      })),
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: business.name,
    inLanguage: "ru-BY",
    publisher: { "@id": businessId },
  };
}
