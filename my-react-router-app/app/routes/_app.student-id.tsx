import React, { useRef } from "react";
import { Link, useLoaderData } from "react-router";
import {
  IdCard,
  Download,
  Info,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  GraduationCap,
  Calendar,
  User,
  QrCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../lib/toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLanguage } from "~/contexts/LanguageContext";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    title: "Digitaler Studentenausweis",
    subtitle:
      "Dein offizieller Identitätsnachweis der IU Internationalen Hochschule.",
    viewBenefits: "Student Benefits ansehen",
    frontSide: "Vorderseite",
    backSide: "Rückseite",
    birthday: "Geburtsdatum",
    matriculationNo: "Matrikelnummer",
    validUntil: "Gültig bis",
    scanToVerify: "Scannen zur Verifizierung",
    contactInfo: "Kontakt & Information",
    forGlobalBenefits: "Für weltweite Vorteile eine",
    applyFor: "beantragen.",
    signature: "Unterschrift des Inhabers",
    downloadPdf: "Als PDF exportieren",
    pdfCreating: "PDF wird generiert...",
    pdfSuccess: "Ausweis erfolgreich heruntergeladen!",
    pdfError: "Fehler beim PDF-Export",
    errorLoading: "Benutzerdaten konnten nicht geladen werden.",
    usageNotes: "Nutzungshinweise",
    usageNote1:
      "Nur in Verbindung mit einem amtlichen Lichtbildausweis gültig.",
    usageNote2: "Der Ausweis ist nicht auf andere Personen übertragbar.",
    usageNote3:
      "Bei Verlust oder Namensänderung bitte das Prüfungsamt informieren.",
    usageNote4: "Berechtigt zu studentischen Vergünstigungen weltweit.",
    benefitsFeatures: "Vorteile & Features",
    benefit1:
      "Offiziell anerkanntes Dokument für Prüfungen und Campus-Zutritt.",
    benefit2: "Direkter Zugriff auf exklusive IU Partner-Rabatte.",
    benefit3: "Integrierter QR-Code für schnelle digitale Validierung.",
    benefit4: "Offline verfügbar nach dem ersten Laden in der App.",
    backToDashboard: "Zurück zum Dashboard",
    officialDocument: "OFFIZIELLES DOKUMENT",
    universityName: "IU Internationale Hochschule",
    universitySub: "University of Applied Sciences",
  },
  en: {
    title: "Digital Student ID",
    subtitle: "Your official proof of identity at IU International University.",
    viewBenefits: "View Student Benefits",
    frontSide: "Front Side",
    backSide: "Back Side",
    birthday: "Date of Birth",
    matriculationNo: "Matriculation No.",
    validUntil: "Valid until",
    scanToVerify: "Scan to verify",
    contactInfo: "Contact & Information",
    forGlobalBenefits: "For global benefits, apply for an",
    applyFor: ".",
    signature: "Holder's Signature",
    downloadPdf: "Export as PDF",
    pdfCreating: "Generating PDF...",
    pdfSuccess: "ID card downloaded successfully!",
    pdfError: "Error during PDF export",
    errorLoading: "Could not load user data.",
    usageNotes: "Usage Notes",
    usageNote1: "Only valid in conjunction with an official photo ID.",
    usageNote2: "The ID card is non-transferable.",
    usageNote3:
      "Please inform the examination office in case of loss or name change.",
    usageNote4: "Entitles you to student discounts worldwide.",
    benefitsFeatures: "Benefits & Features",
    benefit1: "Officially recognized document for exams and campus access.",
    benefit2: "Direct access to exclusive IU partner discounts.",
    benefit3: "Integrated QR code for fast digital validation.",
    benefit4: "Available offline after initial loading in the app.",
    backToDashboard: "Back to Dashboard",
    officialDocument: "OFFICIAL DOCUMENT",
    universityName: "IU International University",
    universitySub: "University of Applied Sciences",
  },
};

export const loader = async ({ request }: { request: Request }) => {
  try {
    const user = await getUserFromRequest(request);
    let userId = user?.id;

    if (!userId) {
      const sabin = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
      });
      userId = sabin?.id;
    }

    if (!userId) return { user: null };

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        studyProgram: true,
        matriculationNumber: true,
        validUntil: true,
      },
    });

    return { user: dbUser };
  } catch (error) {
    console.error("Error loading user:", error);
    return { user: null };
  }
};

export default function StudentIdPage() {
  const { user } = useLoaderData<typeof loader>();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <div className="bg-card/60 backdrop-blur-xl border border-destructive/30 text-destructive p-10 rounded-[2.5rem] max-w-md shadow-2xl text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <p className="font-black uppercase tracking-widest">
            {t.errorLoading}
          </p>
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

      const renderCard = async (
        ref: React.RefObject<HTMLDivElement | null>
      ) => {
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

      pdf.save(`IU_Student_ID_${user.matriculationNumber || "ID"}.pdf`);
      showSuccessToast(t.pdfSuccess);
    } catch (error) {
      console.error("PDF error:", error);
      showErrorToast(t.pdfError);
    }
  };

  const dateLocale = language === "de" ? "de-DE" : "en-US";
  const formatDate = (date: any) => {
    if (!date) return "---";
    return new Date(date).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
              <IdCard size={28} />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>
        <Link
          to="/benefits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-iu-blue/10 text-iu-blue hover:bg-iu-blue/20 font-bold transition-all group"
        >
          {t.viewBenefits}
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Card Display Section */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* FRONT SIDE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
              {t.frontSide}
            </h2>
            <div className="h-px flex-1 bg-border/50 mx-4" />
          </div>

          <div
            ref={frontRef}
            className="relative w-full aspect-[85.6/53.98] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 text-white p-8 flex flex-col justify-between group transition-all duration-500 hover:shadow-iu-blue/20"
          >
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#245eeb_0%,transparent_70%)]" />
            </div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-iu-blue/20 blur-[80px] rounded-full group-hover:bg-iu-blue/30 transition-colors" />

            {/* Card Header */}
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
                <span className="text-slate-950 font-black text-3xl tracking-tighter">
                  iu
                </span>
              </div>
              <div className="text-[9px] font-black text-white/40 text-right leading-tight uppercase tracking-widest">
                {t.universityName}
                <br />
                {t.universitySub}
              </div>
            </div>

            {/* Student Info */}
            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">
                {user.name || "Student Name"}
              </h2>
              <p className="text-sm text-iu-blue font-bold uppercase tracking-widest mb-6">
                {user.studyProgram || "Study Program"}
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">
                    {t.birthday}
                  </p>
                  <p className="font-bold text-sm">
                    {formatDate(user.birthday)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">
                    {t.matriculationNo}
                  </p>
                  <p className="font-bold text-sm">
                    {user.matriculationNumber || "---"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">
                  {t.validUntil}
                </p>
                <p className="font-black text-base text-iu-blue">
                  {formatDate(user.validUntil)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-1.5 rounded-lg shadow-xl">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">
                  {t.scanToVerify}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
              {t.backSide}
            </h2>
            <div className="h-px flex-1 bg-border/50 mx-4" />
          </div>

          <div
            ref={backRef}
            className="relative w-full aspect-[85.6/53.98] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 text-white p-8 flex flex-col justify-between group transition-all duration-500 hover:shadow-purple-500/20"
          >
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-iu-blue rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-widest">
                  {t.contactInfo}
                </h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/60">
                IU Internationale Hochschule GmbH
                <br />
                Juri-Gagarin-Ring 152
                <br />
                99084 Erfurt
                <br />
                Germany
              </p>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 font-medium">
                  {t.forGlobalBenefits}{" "}
                  <a
                    href="https://www.isic.de"
                    className="text-iu-blue font-black hover:underline uppercase tracking-widest"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ISIC Card
                  </a>
                  {t.applyFor}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div className="flex-1 max-w-[200px]">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-2">
                  {t.signature}
                </p>
                <div className="h-10 w-full border-b border-white/20 bg-white/5 rounded-t-lg" />
              </div>
              <div className="text-right text-[8px] font-black text-white/20 uppercase tracking-widest">
                © {new Date().getFullYear()} IU UNIVERSITY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-8 py-12">
        <button
          onClick={handleDownloadPDF}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-iu-blue text-white font-black rounded-2xl shadow-2xl shadow-iu-blue/20 hover:shadow-iu-blue/40 transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-[0.2em]"
        >
          <Download className="w-6 h-6 group-hover:animate-bounce" />
          {t.downloadPdf}
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backToDashboard}
        </Link>
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">
                {t.usageNotes}
              </h3>
            </div>

            <ul className="space-y-6">
              {[t.usageNote1, t.usageNote2, t.usageNote3, t.usageNote4].map(
                (note, i) => (
                  <li key={i} className="flex items-start gap-4 group/item">
                    <div className="mt-1.5">
                      <CheckCircle2 className="w-5 h-5 text-iu-blue opacity-50 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-muted-foreground font-medium leading-relaxed group-hover/item:text-foreground transition-colors">
                      {note}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-foreground tracking-tight">
                {t.benefitsFeatures}
              </h3>
            </div>

            <ul className="space-y-6">
              {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(
                (benefit, i) => (
                  <li key={i} className="flex items-start gap-4 group/item">
                    <div className="mt-1.5">
                      <CheckCircle2 className="w-5 h-5 text-iu-blue opacity-50 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-muted-foreground font-medium leading-relaxed group-hover/item:text-foreground transition-colors">
                      {benefit}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
