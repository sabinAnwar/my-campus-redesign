import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { prisma } from "../lib/prisma";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/faq";

// Components
import { FAQBackground } from "~/components/faq/FAQBackground";
import { ChatHomePage } from "~/components/faq/ChatHomePage";
import { ChatInterface } from "~/components/faq/ChatInterface";

export const loader = async () => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { category: "asc" },
    });
    return { faqs };
  } catch (error) {
    console.error("Error loading FAQs:", error);
    return { faqs: [] };
  }
};

export default function FAQRoute() {
  const { faqs } = useLoaderData() as { faqs: any[] };
  const [currentPage, setCurrentPage] = useState("home");
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const navigate = (page: string) => setCurrentPage(page);

  return (
    <div className="min-h-screen text-foreground">
      <FAQBackground />
      <div className="relative z-10">
        {currentPage === "home" && (
          <ChatHomePage 
            onNavigate={navigate} 
            t={t} 
            features={t.features} 
          />
        )}
        {currentPage === "chat" && (
          <ChatInterface 
            onNavigate={navigate} 
            faqs={faqs} 
            t={t} 
          />
        )}
      </div>
    </div>
  );
}
