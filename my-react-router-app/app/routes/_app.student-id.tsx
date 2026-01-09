import React, { useRef } from "react";
import { Link, useLoaderData } from "react-router";
import {
  IdCard,
  Download,
  Info,
  ShieldCheck,
  ExternalLink,
  QrCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../lib/toast";
import jsPDF from "jspdf";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/student-id";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { PageHeader } from "~/components/shared/PageHeader";

export const loader = async ({ request }: { request: Request }) => {
  try {
    const user = await getUserFromRequest(request);
    let userId = user?.id;

    if (!userId) {
      const demo = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
      });
      userId = demo?.id;
    }

    if (!userId) return { user: null };

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        study_program: true,
        matriculation_number: true,
        valid_until: true,
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
        <div className="bg-iu-red/10 dark:bg-iu-red backdrop-blur-xl border border-iu-red/30 dark:border-iu-red text-iu-red dark:text-white p-6 sm:p-10 rounded-[2.5rem] max-w-md shadow-2xl text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
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
      
      // Use jsPDF directly to draw the card without html2canvas (avoids oklch/oklab issues)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      // Card dimensions in mm (standard credit card size)
      const cardWidth = 85.6;
      const cardHeight = 53.98;
      const padding = 4;

      // Draw front card
      // Background
      pdf.setFillColor(15, 23, 42); // Slate-900
      pdf.rect(0, 0, cardWidth, cardHeight, 'F');
      
      // IU Logo box
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(padding, padding, 14, 6, 1, 1, 'F');
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('iu', padding + 2, padding + 4.5);
      
      // University name (top right)
      pdf.setTextColor(100, 116, 139); // Slate-500
      pdf.setFontSize(4);
      pdf.text(t.universityName, cardWidth - padding, padding + 2, { align: 'right' });
      pdf.text(t.universitySub, cardWidth - padding, padding + 4.5, { align: 'right' });
      
      // Student name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text((user.name || 'Student Name').toUpperCase(), padding, 22);
      
      // Study program
      pdf.setTextColor(37, 99, 235); // IU Blue
      pdf.setFontSize(5);
      pdf.text((user.study_program || 'Study Program').toUpperCase(), padding, 26);
      
      // Birthday label
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(3.5);
      pdf.text(t.birthday.toUpperCase(), padding, 32);
      
      // Birthday value
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(5);
      pdf.text(formatDate(user.birthday), padding, 35);
      
      // Matriculation label
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(3.5);
      pdf.text(t.matriculationNo.toUpperCase(), 35, 32);
      
      // Matriculation value
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(5);
      pdf.text(user.matriculation_number || '---', 35, 35);
      
      // Valid until label
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(3.5);
      pdf.text(t.validUntil.toUpperCase(), padding, cardHeight - 10);
      
      // Valid until value
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatDate(user.valid_until), padding, cardHeight - 6);
      
      // QR Code placeholder
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(cardWidth - padding - 12, cardHeight - 18, 12, 12, 1, 1, 'F');
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(6);
      pdf.text('QR', cardWidth - padding - 6, cardHeight - 11, { align: 'center' });
      
      // Scan to verify
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(2.5);
      pdf.text(t.scanToVerify.toUpperCase(), cardWidth - padding - 6, cardHeight - 4, { align: 'center' });

      // BACK CARD
      pdf.addPage([85.6, 53.98], 'landscape');
      
      // Background
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, cardWidth, cardHeight, 'F');
      
      // Blue accent line
      pdf.setFillColor(37, 99, 235);
      pdf.rect(padding, padding + 2, 1, 4, 'F');
      
      // Contact info title
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6);
      pdf.text(t.contactInfo.toUpperCase(), padding + 3, padding + 5);
      
      // Address
      pdf.setTextColor(148, 163, 184); // Slate-400
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5);
      pdf.text('IU Internationale Hochschule GmbH', padding, padding + 12);
      pdf.text('Juri-Gagarin-Ring 152', padding, padding + 16);
      pdf.text('99084 Erfurt', padding, padding + 20);
      pdf.text('Germany', padding, padding + 24);
      
      // Border line
      pdf.setDrawColor(100, 116, 139);
      pdf.line(padding, 34, cardWidth - padding, 34);
      
      // ISIC info
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(4);
      pdf.text(t.forGlobalBenefits + ' ISIC Card ' + t.applyFor, padding, 38);
      
      // Signature line
      pdf.setFontSize(3);
      pdf.text(t.signature.toUpperCase(), padding, cardHeight - 6);
      pdf.setDrawColor(100, 116, 139);
      pdf.line(padding, cardHeight - 4, 40, cardHeight - 4);
      
      // Copyright
      pdf.setFontSize(3);
      pdf.text(`© ${new Date().getFullYear()} IU UNIVERSITY`, cardWidth - padding, cardHeight - 4, { align: 'right' });

      pdf.save(`IU_Student_ID_${user.matriculation_number || "ID"}.pdf`);
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
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
      <PageHeader
        icon={IdCard}
        title={t.title}
        subtitle={t.subtitle}
      >
        <Link
          to="/benefits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white hover:bg-iu-blue/20 dark:hover:bg-iu-blue transition-all group shadow-sm border border-iu-blue/10 dark:border-iu-blue"
        >
          {t.viewBenefits}
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </PageHeader>

      {/* Card Display Section */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
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
              <div className="text-[9px] font-black text-white text-right leading-tight uppercase tracking-widest">
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
              <p className="text-sm text-white font-bold uppercase tracking-widest mb-6">
                {user.study_program || "Study Program"}
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] text-white font-black uppercase tracking-widest mb-1">
                    {t.birthday}
                  </p>
                  <p className="font-bold text-sm">
                    {formatDate(user.birthday)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-white font-black uppercase tracking-widest mb-1">
                    {t.matriculationNo}
                  </p>
                  <p className="font-bold text-sm">
                    {user.matriculation_number || "---"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[9px] text-white font-black uppercase tracking-widest mb-1">
                  {t.validUntil}
                </p>
                <p className="font-black text-base text-white">
                  {formatDate(user.valid_until)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-1.5 rounded-lg shadow-xl">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <span className="text-[7px] font-black text-white uppercase tracking-widest">
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
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-iu-purple blur-[80px] rounded-full group-hover:bg-iu-purple transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-iu-blue rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-widest">
                  {t.contactInfo}
                </h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-white">
                IU Internationale Hochschule GmbH
                <br />
                Juri-Gagarin-Ring 152
                <br />
                99084 Erfurt
                <br />
                Germany
              </p>

              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="text-xs text-white font-medium">
                  {t.forGlobalBenefits}{" "}
                   <a
                    href="https://www.isic.de"
                    className="text-white font-black hover:underline uppercase tracking-widest"
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
                <p className="text-[9px] text-white font-black uppercase tracking-widest mb-2">
                  {t.signature}
                </p>
                <div className="h-10 w-full border-b border-white/40 bg-white/10 rounded-t-lg" />
              </div>
              <div className="text-right text-[8px] font-black text-white uppercase tracking-widest">
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

      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white shadow-sm border border-iu-blue/10 dark:border-iu-blue">
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
                      <CheckCircle2 className="w-5 h-5 text-iu-blue dark:text-white" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed">
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
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white shadow-sm border border-iu-blue/10 dark:border-iu-blue">
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
                      <CheckCircle2 className="w-5 h-5 text-iu-blue dark:text-white" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed">
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
