import React from "react";
import { Download, FileText, Calendar, User, GraduationCap, Building2, CheckCircle, Shield } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { jsPDF } from "jspdf";

const TEXT = {
  de: {
    title: "Immatrikulationsbescheinigung",
    subtitle: "Deine offizielle Bescheinigung über die Immatrikulation an der IU",
    studentInfo: "Studenteninformationen",
    name: "Name",
    studentId: "Matrikelnummer",
    program: "Studiengang",
    semester: "Fachsemester",
    enrollmentDate: "Immatrikuliert seit",
    status: "Status",
    statusActive: "Aktiv immatrikuliert",
    certificateTitle: "Bescheinigung",
    certificateText: "Hiermit wird bescheinigt, dass",
    isEnrolled: "an der IU Internationale Hochschule im Studiengang",
    inSemester: "im",
    semesterText: "Fachsemester",
    enrolledSince: "immatrikuliert ist seit",
    issueDate: "Ausstellungsdatum",
    downloadPdf: "Als PDF herunterladen",
    validity: "Gültigkeit",
    validityText: "Diese Bescheinigung ist bis zum Ende des laufenden Semesters gültig.",
    officialStamp: "Offizielles Siegel",
    registrarOffice: "Studierendensekretariat",
  },
  en: {
    title: "Certificate of Enrollment",
    subtitle: "Your official certificate of enrollment at IU",
    studentInfo: "Student Information",
    name: "Name",
    studentId: "Student ID",
    program: "Program",
    semester: "Semester",
    enrollmentDate: "Enrolled since",
    status: "Status",
    statusActive: "Actively enrolled",
    certificateTitle: "Certificate",
    certificateText: "This is to certify that",
    isEnrolled: "is enrolled at IU International University of Applied Sciences in the program",
    inSemester: "in the",
    semesterText: "semester",
    enrolledSince: "since",
    issueDate: "Issue date",
    downloadPdf: "Download as PDF",
    validity: "Validity",
    validityText: "This certificate is valid until the end of the current semester.",
    officialStamp: "Official Seal",
    registrarOffice: "Registrar's Office",
  },
};

import { getUserFromRequest } from "~/lib/auth.server";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // 1. Try session user
    let user = await getUserFromRequest(request);

    // 2. Fallback to Sabin
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
        include: { studiengang: true },
      });
    } else {
      // Ensure relations are loaded if getUserFromRequest didn't load them (it loads basic fields usually)
      // But getUserFromRequest usually returns the user object.
      // Let's re-fetch to be safe and consistent with include
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { studiengang: true },
      });
    }

    if (!user) {
      return { user: null };
    }

    return { user };
  } catch (error) {
    console.error("Error loading user:", error);
    return { user: null };
  }
};

export default function ImmatriculationCertificatePage() {
  const { language } = useLanguage();
  const { user } = useLoaderData<typeof loader>();
  const t = TEXT[language];

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            No user data found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Please log in to view your certificate.
          </p>
        </div>
      </div>
    );
  }

  const studentData = {
    name: user.name || "Student Name",
    studentId: user.matriculationNumber || "12345678",
    program:
      user.studyProgram ||
      user.studiengang?.name ||
      (language === "de" ? "Informatik (B.Sc.)" : "Computer Science (B.Sc.)"),
    semester: "5",
    enrollmentDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString(
          language === "de" ? "de-DE" : "en-US"
        )
      : "01.10.2022",
    status: t.statusActive,
  };

  const today = new Date().toLocaleDateString(
    language === "de" ? "de-DE" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add decorative border
    doc.setDrawColor(59, 130, 246); // Blue
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header with gradient effect (simulated with rectangles)
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setFillColor(139, 92, 246); // Violet overlay
    const GS = (doc as any).GState;
    doc.setGState(new GS({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new GS({ opacity: 1 }));

    // IU Logo placeholder (text-based)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IU", pageWidth / 2, 30, { align: "center" });

    // Certificate Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(t.certificateTitle, pageWidth / 2, 55, { align: "center" });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("IU Internationale Hochschule", pageWidth / 2, 62, {
      align: "center",
    });

    // Decorative line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(40, 70, pageWidth - 40, 70);

    // Certificate body
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // Slate-700
    doc.setFont("helvetica", "normal");

    let yPos = 85;
    doc.text(t.certificateText, pageWidth / 2, yPos, { align: "center" });

    // Student name (highlighted)
    yPos += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(studentData.name, pageWidth / 2, yPos, { align: "center" });

    // Student ID in smaller text
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${t.studentId}: ${studentData.studentId}`, pageWidth / 2, yPos, {
      align: "center",
    });

    // Program info
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text(t.isEnrolled, pageWidth / 2, yPos, { align: "center" });

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text(studentData.program, pageWidth / 2, yPos, { align: "center" });

    // Semester info
    yPos += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text(
      `${t.inSemester} ${studentData.semester}. ${t.semesterText}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    );

    yPos += 8;
    doc.text(
      `${t.enrolledSince} ${studentData.enrollmentDate}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    );

    // Decorative box for validity
    yPos += 20;
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.setDrawColor(191, 219, 254); // Blue-200
    doc.roundedRect(30, yPos, pageWidth - 60, 20, 3, 3, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175); // Blue-800
    doc.text(t.validity, pageWidth / 2, yPos + 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(59, 130, 246);
    doc.text(t.validityText, pageWidth / 2, yPos + 14, { align: "center" });

    // Official stamp area
    yPos += 35;
    doc.setDrawColor(139, 92, 246); // Violet
    doc.setLineWidth(1);
    doc.circle(40, yPos + 15, 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 92, 246);
    doc.text(t.officialStamp, 40, yPos + 15, { align: "center" });

    // Issue date and office
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${t.issueDate}: ${today}`, pageWidth - 40, yPos + 10, {
      align: "right",
    });
    doc.text(t.registrarOffice, pageWidth - 40, yPos + 16, { align: "right" });

    // Signature line
    yPos += 35;
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.3);
    doc.line(pageWidth - 80, yPos, pageWidth - 30, yPos);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Unterschrift", pageWidth - 55, yPos + 5, { align: "center" });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "IU Internationale Hochschule GmbH",
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );
    doc.text(
      "Juri-Gagarin-Ring 152, 99084 Erfurt",
      pageWidth / 2,
      pageHeight - 16,
      { align: "center" }
    );
    doc.text("www.iu.de", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`Immatrikulationsbescheinigung_${studentData.studentId}.pdf`);
  };

  return (
    <div className="space-y-8">
        {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <GraduationCap size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
            
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
              <Shield size={16} />
              <span>OFFICIAL DOCUMENT</span>
            </div>
          </div>
        </div>
      </header>

        {/* Student Info Card */}
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden">
          {/* Hover background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
              <div className="p-3 rounded-2xl bg-iu-blue/10 border border-iu-blue/20 text-iu-blue shadow-lg">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                {t.studentInfo}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
                <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
                  {t.name}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                  {studentData.name}
                </p>
              </div>
              <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
                <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
                  {t.studentId}
                </p>
                <p className="text-xl font-bold text-foreground tracking-widest group-hover:text-iu-blue transition-colors">
                  {studentData.studentId}
                </p>
              </div>
              <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
                <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
                  {t.program}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                  {studentData.program}
                </p>
              </div>
              <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
                <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
                  {t.semester}
                </p>
                <p className="text-xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                  {studentData.semester}. {t.semesterText}
                </p>
              </div>
              <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
                <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
                  {t.enrollmentDate}
                </p>
                <p className="text-xl font-bold text-foreground tracking-widest group-hover:text-iu-blue transition-colors">
                  {studentData.enrollmentDate}
                </p>
              </div>
              <div className="p-6 bg-iu-blue/10 rounded-3xl border border-iu-blue/20 shadow-xl shadow-iu-blue/5 group hover:bg-iu-blue/20 transition-all duration-500">
                <p className="text-[10px] text-iu-blue dark:text-iu-blue mb-2 font-black uppercase tracking-widest">
                  {t.status}
                </p>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-iu-blue dark:text-iu-blue" />
                  <p className="text-xl font-bold text-iu-blue dark:text-iu-blue tracking-tight">
                    {studentData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="relative bg-card/40 backdrop-blur-xl rounded-[2.5rem] border-4 border-iu-blue/20 p-12 shadow-2xl overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-iu-blue/20 rounded-tl-2xl" />
          <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-iu-blue/20 rounded-tr-2xl" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-iu-blue/20 rounded-bl-2xl" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-iu-blue/20 rounded-br-2xl" />

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-iu-blue rounded-3xl mb-8 shadow-2xl shadow-iu-blue/30 transition-transform hover:rotate-12">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              {t.certificateTitle}
            </h2>
            <p className="text-muted-foreground text-xl font-medium">
              IU Internationale Hochschule
            </p>
            <div className="w-40 h-1.5 bg-iu-blue mx-auto mt-6 rounded-full shadow-lg shadow-iu-blue/20" />
          </div>

          <div className="space-y-8 text-foreground/80 max-w-2xl mx-auto relative z-10">
            <p className="text-center text-xl font-medium">
              {t.certificateText}
            </p>
            <p className="text-center text-4xl font-bold text-foreground tracking-tight">
              {studentData.name}
            </p>
            <p className="text-center text-base text-muted-foreground/60 font-bold tracking-widest uppercase">
              {t.studentId}: {studentData.studentId}
            </p>
            <p className="text-center text-xl font-medium">{t.isEnrolled}</p>
            <p className="text-center text-2xl font-bold text-iu-blue tracking-tight">
              {studentData.program}
            </p>
            <p className="text-center text-xl font-medium leading-relaxed">
              {t.inSemester}{" "}
              <span className="font-bold text-foreground">
                {studentData.semester}. {t.semesterText}
              </span>{" "}
              {t.enrolledSince}{" "}
              <span className="font-bold text-foreground">
                {studentData.enrollmentDate}
              </span>
              .
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-4 border-iu-blue/20 rounded-2xl flex items-center justify-center bg-iu-blue/5 shadow-inner">
                <Shield className="h-10 w-10 text-iu-blue" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest mb-1">
                  {t.officialStamp}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {t.registrarOffice}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-3 text-sm text-muted-foreground font-bold mb-4">
                <Calendar className="h-5 w-5 text-iu-blue/40" />
                <span>
                  {t.issueDate}: {today}
                </span>
              </div>
              <div className="w-48 h-px bg-border mx-auto md:ml-auto mb-2" />
              <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest">
                Unterschrift
              </p>
            </div>
          </div>
        </div>

        {/* Validity Info */}
        <div className="bg-iu-blue/5 border border-iu-blue/20 rounded-[2rem] p-8 shadow-xl backdrop-blur-md group hover:bg-iu-blue/10 transition-all duration-500">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-iu-blue rounded-2xl shadow-xl shadow-iu-blue/20 group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                {t.validity}
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                {t.validityText}
              </p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="w-full flex items-center justify-center gap-4 bg-foreground text-background font-bold py-6 px-10 rounded-[2rem] transition-all shadow-2xl hover:opacity-90 active:scale-95 text-lg group"
        >
          <Download className="h-7 w-7 group-hover:translate-y-1 transition-transform" />
          {t.downloadPdf}
        </button>
      </div>
    );
}
  