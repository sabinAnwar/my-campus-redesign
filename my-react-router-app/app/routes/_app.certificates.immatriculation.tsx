import React from "react";
import { Download, FileText, Calendar, User, GraduationCap, Building2, CheckCircle, Shield } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import jsPDF from "jspdf";

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

export const loader = async () => {
  try {
    // Get the first user (in production, you'd get the logged-in user)
    const user = await prisma.user.findFirst({
      include: {
        studiengang: true,
      },
    });

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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">No user data found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Please log in to view your certificate.</p>
        </div>
      </div>
    );
  }

  const studentData = {
    name: user.name || "Student Name",
    studentId: user.matriculationNumber || "12345678",
    program: user.studyProgram || user.studiengang?.name || (language === "de" ? "Informatik (B.Sc.)" : "Computer Science (B.Sc.)"),
    semester: "5",
    enrollmentDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString(language === "de" ? "de-DE" : "en-US") : "01.10.2022",
    status: t.statusActive,
  };

  const today = new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    doc.setGState(new doc.GState({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));

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
    doc.text("IU Internationale Hochschule", pageWidth / 2, 62, { align: "center" });

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
    doc.text(`${t.studentId}: ${studentData.studentId}`, pageWidth / 2, yPos, { align: "center" });

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
    doc.text(`${t.inSemester} ${studentData.semester}. ${t.semesterText}`, pageWidth / 2, yPos, { align: "center" });

    yPos += 8;
    doc.text(`${t.enrolledSince} ${studentData.enrollmentDate}`, pageWidth / 2, yPos, { align: "center" });

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
    doc.text(`${t.issueDate}: ${today}`, pageWidth - 40, yPos + 10, { align: "right" });
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
    doc.text("IU Internationale Hochschule GmbH", pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.text("Juri-Gagarin-Ring 152, 99084 Erfurt", pageWidth / 2, pageHeight - 16, { align: "center" });
    doc.text("www.iu.de", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`Immatrikulationsbescheinigung_${studentData.studentId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">{t.title}</h1>
              <p className="text-blue-100 mt-2 text-lg">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.studentInfo}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.name}</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{studentData.name}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.studentId}</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{studentData.studentId}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.program}</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{studentData.program}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.semester}</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{studentData.semester}. {t.semesterText}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{t.enrollmentDate}</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{studentData.enrollmentDate}</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">{t.status}</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{studentData.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border-4 border-blue-200 dark:border-blue-800 p-10 shadow-2xl">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-violet-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-violet-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-violet-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-violet-400 rounded-br-lg" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full mb-6 shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">{t.certificateTitle}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">IU Internationale Hochschule</p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-violet-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
            <p className="text-center text-lg">{t.certificateText}</p>
            <p className="text-center text-2xl font-black text-neutral-900 dark:text-white">{studentData.name}</p>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">{t.studentId}: {studentData.studentId}</p>
            <p className="text-center text-lg">{t.isEnrolled}</p>
            <p className="text-center text-xl font-bold text-blue-600 dark:text-blue-400">{studentData.program}</p>
            <p className="text-center text-lg">
              {t.inSemester} <span className="font-bold">{studentData.semester}. {t.semesterText}</span> {t.enrolledSince} <span className="font-bold">{studentData.enrollmentDate}</span>.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t-2 border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-4 border-violet-500 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{t.officialStamp}</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{t.registrarOffice}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span>{t.issueDate}: {today}</span>
              </div>
              <div className="w-32 h-px bg-neutral-300 dark:bg-neutral-700 ml-auto mb-1" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Unterschrift</p>
            </div>
          </div>
        </div>

        {/* Validity Info */}
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">{t.validity}</h3>
              <p className="text-blue-700 dark:text-blue-300">{t.validityText}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
        >
          <Download className="h-6 w-6" />
          {t.downloadPdf}
        </button>
      </div>
    </div>
  );
}
