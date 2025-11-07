import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import AppShell from "../components/AppShell"; // Weiterverwendung Ihrer AppShell

// --- 1. Die FAQ-Daten ---
// Diese Daten sollten idealerweise von einem CMS oder einer API kommen,
// aber für den Anfang ist ein Array perfekt.
const faqData = [
  {
    id: "d1",
    category: "Dokumente & Ausweise",
    question: "Wo finde ich meine Immatrikulationsbescheinigung?",
    answer:
      'Ihre Immatrikulationsbescheinigung finden Sie in Ihrem Studierendenportal im Bereich "Meine Dokumente". Sie können sie dort jederzeit als PDF herunterladen.',
  },
  {
    id: "d2",
    category: "Dokumente & Ausweise",
    question:
      "Wie lade ich meinen digitalen Studentenausweis als PDF herunter?",
    answer:
      'Gehen Sie zur Seite "Digitaler Studentenausweis". Dort sehen Sie die Vorschau der Vorder- und Rückseite. Klicken Sie einfach auf den Button "Als PDF herunterladen", um die Erstellung zu starten.',
  },
  {
    id: "s1",
    category: "Studium & Prüfungen",
    question: "Wie melde ich mich für eine Prüfung an oder ab?",
    answer:
      "Die Prüfungsan- und -abmeldung erfolgt ausschließlich über das Prüfungsportal. Beachten Sie bitte die Fristen! Eine Anmeldung nach Fristende ist nicht möglich. Bei technischen Problemen wenden Sie sich sofort an das Prüfungsamt.",
  },
  {
    id: "s2",
    category: "Studium & Prüfungen",
    question: "Wo finde ich meine Notenübersicht (Transcript of Records)?",
    answer:
      'Ihr aktuelles Transcript of Records wird ebenfalls im Prüfungsportal generiert. Sie finden es unter dem Menüpunkt "Notenübersicht".',
  },
  {
    id: "s3",
    category: "Studium & Prüfungen",
    question: "An wen wende ich mich bei Fragen zu meinem Studienverlauf?",
    answer:
      "Bei organisatorischen Fragen zu Ihrem Studienverlauf ist die Studienberatung (Study Coaching) Ihr erster Ansprechpartner. Bei fachlichen Fragen zu einem bestimmten Modul wenden Sie sich bitte an den jeweiligen Professor oder Tutor.",
  },
  {
    id: "t1",
    category: "Technik & Accounts",
    question: "Ich habe mein Passwort für das Portal vergessen. Was tun?",
    answer:
      'Auf der Login-Seite finden Sie einen Link "Passwort vergessen". Folgen Sie den Anweisungen, um Ihr Passwort per E-Mail zurückzusetzen. Stellen Sie sicher, dass Sie Zugriff auf Ihre hinterlegte private E-Mail-Adresse haben.',
  },
  {
    id: "t2",
    category: "Technik & Accounts",
    question: "Wie erhalte ich Zugriff auf das Campus-WLAN?",
    answer:
      'Für den Zugriff auf das "eduroam"-Netzwerk benötigen Sie Ihre Hochschul-E-Mail-Adresse und ein separates WLAN-Passwort, das Sie im IT-Portal generieren können.',
  },
  {
    id: "f1",
    category: "Finanzen & Support",
    question: "Wo sehe ich den Status meiner Studiengebühren?",
    answer:
      'Eine Übersicht über Ihre gezahlten und offenen Beiträge finden Sie im Studierendenportal unter "Meine Finanzen". Dort können Sie auch Rechnungen herunterladen.',
  },
];

// --- 2. Die Accordion-Item-Komponente ---
// Wir erstellen eine separate Komponente für jedes FAQ-Item, um den Code sauber zu halten.
function FaqItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-slate-200">
      {/* Der klickbare Frage-Button */}
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 px-6 text-left hover:bg-slate-50 focus:outline-none"
      >
        <span className="text-lg font-medium text-slate-800">
          {item.question}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Die Antwort (wird ein- und ausgeblendet) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-5 text-slate-600 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

// --- 3. Die Haupt-FAQ-Seite ---
export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null); // Speichert die ID des offenen Items

  // useMemo sorgt dafür, dass die Filterung nur bei Bedarf neu läuft
  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqData;

    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Einzigartige Kategorien aus den gefilterten FAQs extrahieren
  const categories = useMemo(() => {
    return [...new Set(filteredFAQs.map((item) => item.category))];
  }, [filteredFAQs]);

  const handleToggle = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          {/* --- Header & Suchleiste --- */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              Hilfe & Support
            </h1>
            <p className="text-lg text-slate-600">
              Finden Sie schnelle Antworten auf Ihre Fragen.
            </p>
          </header>

          <div className="mb-12">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Frage suchen (z.B. 'Prüfung', 'Passwort')..."
                className="w-full rounded-xl border border-slate-300 p-4 pl-12 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* --- FAQ-Liste --- */}
          <div className="space-y-10">
            {/* Wir rendern nur Kategorien, wenn NICHT gesucht wird.
              Wenn gesucht wird, zeigen wir eine flache Liste der Ergebnisse.
            */}
            {searchTerm ? (
              // Ansicht bei aktiver Suche (flache Liste)
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((item) => (
                    <FaqItem
                      key={item.id}
                      item={item}
                      isOpen={openFAQ === item.id}
                      onClick={() => handleToggle(item.id)}
                    />
                  ))
                ) : (
                  <p className="p-6 text-center text-slate-500">
                    Keine Ergebnisse für Ihre Suche gefunden.
                  </p>
                )}
              </div>
            ) : (
              // Standardansicht (gruppiert nach Kategorie)
              categories.map((category) => (
                <section key={category}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-5">
                    {category}
                  </h2>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {filteredFAQs
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <FaqItem
                          key={item.id}
                          item={item}
                          isOpen={openFAQ === item.id}
                          onClick={() => handleToggle(item.id)}
                        />
                      ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
