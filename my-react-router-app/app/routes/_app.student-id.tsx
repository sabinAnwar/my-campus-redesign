import React, { useRef } from "react";
import { Link, useLoaderData } from "react-router-dom";

import { showSuccessToast, showErrorToast } from "../lib/toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Digitaler Studentenausweis",
    subtitle: "IU Internationale Hochschule · Offizieller Studierendenausweis",
    viewBenefits: "Student Benefits ansehen",
    frontSide: "Vorderseite",
    backSide: "Rückseite",
    birthday: "Geburtstag",
    matriculationNo: "Matrikelnr.",
    validUntil: "Gültig bis",
    scanToVerify: "Scannen zur Verifizierung",
    contactInfo: "Kontakt & Info",
    forGlobalBenefits: "Für globale Vorteile eine",
    applyFor: "beantragen.",
    signature: "Unterschrift",
    downloadPdf: "Als PDF herunterladen",
    pdfCreating: "PDF wird erstellt …",
    pdfSuccess: "PDF erfolgreich heruntergeladen!",
    pdfError: "Fehler beim Erstellen der PDF",
    errorLoading: "Fehler beim Laden der Benutzerdaten.",
    usageNotes: "Nutzungshinweise",
    usageNote1: "Nur in Verbindung mit einem Lichtbildausweis gültig",
    usageNote2: "Bewahre deinen Ausweis sicher auf",
    usageNote3: "Bei Verlust informiere umgehend dein Studienzentrum",
    usageNote4: "Berechtigt zu Vergünstigungen (ÖPNV, Kultur, Freizeit)",
    benefitsFeatures: "Vorteile & Features",
    benefit1: "Weltweit anerkannt als offizieller Studierendenausweis",
    benefit2: "Zugang zu Studentenrabatten und -angeboten",
    benefit3: "QR-Code zur einfachen Verifizierung",
    benefit4: "Immer verfügbar auf allen deinen Geräten",
  },
  en: {
    title: "Digital Student ID",
    subtitle: "IU International University · Official Student ID Card",
    viewBenefits: "View Student Benefits",
    frontSide: "Front Side",
    backSide: "Back Side",
    birthday: "Birthday",
    matriculationNo: "Matriculation No.",
    validUntil: "Valid until",
    scanToVerify: "Scan to verify",
    contactInfo: "Contact & Info",
    forGlobalBenefits: "For global benefits, apply for an",
    applyFor: ".",
    signature: "Signature",
    downloadPdf: "Download as PDF",
    pdfCreating: "Creating PDF …",
    pdfSuccess: "PDF downloaded successfully!",
    pdfError: "Error creating PDF",
    errorLoading: "Error loading user data.",
    usageNotes: "Usage Notes",
    usageNote1: "Only valid with a photo ID",
    usageNote2: "Keep your ID card safe",
    usageNote3: "Report loss immediately to your study center",
    usageNote4: "Entitles you to discounts (public transport, culture, leisure)",
    benefitsFeatures: "Benefits & Features",
    benefit1: "Internationally recognized as official student ID",
    benefit2: "Access to student discounts and offers",
    benefit3: "QR code for easy verification",
    benefit4: "Always available on all your devices",
  },
};

export async function loader() {
  try {
    const user = {
      id: 1,
      name: "Sabin El Anwar",
      email: "sabin.elanwar@iu-study.org",
      birthday: "2000-02-10",
      studyProgram: "Wirtschaftsinformatik",
      matriculationNumber: "102203036",
      validUntil: "2026-03-31",
    };
    return { user };
  } catch (error) {
    console.error("Error loading user:", error);
    return { user: null };
  }
}

export default function StudentIdPage() {
  const { user } = useLoaderData();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-6 rounded-lg max-w-md shadow">
          <p className="font-medium text-center">{t.errorLoading}</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      showSuccessToast(t.pdfCreating);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      const renderCard = async (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) {
          throw new Error("Ref element is not available");
        }
        const canvas = await html2canvas(ref.current as HTMLElement, {
          scale: 4,
          useCORS: true,
          backgroundColor: null,
        });
        return canvas.toDataURL("image/png");
      };

      const front = await renderCard(frontRef);
      const back = await renderCard(backRef);

      pdf.addImage(front, "PNG", 0, 0, 85.6, 53.98);
      pdf.addPage();
      pdf.addImage(back, "PNG", 0, 0, 85.6, 53.98);

      pdf.save(`Studentenausweis_${user.matriculationNumber}.pdf`);
      showSuccessToast(t.pdfSuccess);
    } catch (error) {
      console.error("PDF error:", error);
      showErrorToast(t.pdfError);
    }
  };

  const dateLocale = language === "de" ? "de-DE" : "en-US";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <header className="text-center mb-14">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t.subtitle}
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              to="/benefits"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {t.viewBenefits}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </header>

        {/* CARD DISPLAY */}
        <section className="grid md:grid-cols-2 gap-10 mb-16">
          {/* FRONT */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {t.frontSide}
            </h2>
            <div
              ref={frontRef}
              className="relative w-full aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/10 dark:border-slate-700/50 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
                  <span className="text-[#0f172a] font-black text-2xl">
                    iu
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 text-right leading-tight">
                  INTERNATIONALE
                  <br />
                  HOCHSCHULE
                  <br />
                  OF APPLIED SCIENCES
                </div>
              </div>

              {/* Student Info */}
              <div className="mt-3">
                <h2 className="text-xl font-bold tracking-wide mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-300 mb-4">
                  {user.studyProgram}
                </p>

                <div className="grid grid-cols-2 gap-3 text-[11px] mb-4">
                  <div>
                    <p className="text-slate-400 mb-1">{t.birthday}</p>
                    <p className="font-semibold">
                      {new Date(user.birthday).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">{t.matriculationNo}</p>
                    <p className="font-semibold">
                      {user.matriculationNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 text-[10px]">{t.validUntil}</p>
                  <p className="font-semibold text-sm">
                    {new Date(user.validUntil).toLocaleDateString(dateLocale)}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=IU%20Student%20ID"
                    alt="QR"
                    className="rounded-md"
                  />
                  <span className="text-[9px] text-slate-400 mt-1">
                    {t.scanToVerify}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {t.backSide}
            </h2>
            <div
              ref={backRef}
              className="relative w-full aspect-[85.6/53.98] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/10 dark:border-slate-700/50 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              <div>
                <h3 className="text-lg font-bold mb-3">{t.contactInfo}</h3>
                <p className="text-sm leading-relaxed">
                  IU Internationale Hochschule
                  <br />
                  Albert-Proeller-Str. 15–19
                  <br />
                  86675 Buchdorf
                  <br />
                  Germany
                </p>

                <div className="mt-4 border-t border-slate-600 pt-3 text-xs text-slate-300">
                  <p>
                    {t.forGlobalBenefits}{" "}
                    <a
                      href="https://www.isic.de"
                      className="text-blue-400 font-semibold hover:text-blue-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ISIC Card
                    </a>
                    {t.applyFor}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">{t.signature}</p>
                  <div className="h-[20px] w-[100px] border-b border-slate-400"></div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  © {new Date().getFullYear()} IU Internationale Hochschule
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOWNLOAD BUTTON */}
        <div className="flex justify-center mb-20">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transform hover:scale-105 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t.downloadPdf}
          </button>
        </div>

        {/* NOTES & INFO */}
        <section className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t.usageNotes}
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.usageNote1}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.usageNote2}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.usageNote3}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.usageNote4}
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl shadow-lg p-8 border border-blue-200/50 dark:border-blue-800/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {t.benefitsFeatures}
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.benefit1}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.benefit2}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.benefit3}
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  {t.benefit4}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
