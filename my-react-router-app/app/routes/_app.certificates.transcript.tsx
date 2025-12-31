import React, { useState, useMemo } from "react";
import {
  Download,
  Award,
  Calendar,
  User,
  GraduationCap,
  TrendingUp,
  FileText,
  CheckCircle,
  Filter,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { jsPDF } from "jspdf";
import { getUserFromRequest } from "~/lib/auth.server";
import { getCourseConfig } from "../data/coursesConfig";

const TEXT = {
  de: {
    title: "Leistungsnachweis",
    subtitle: "Transcript of Records - Deine erbrachten Studienleistungen",
    studentInfo: "Studenteninformationen",
    name: "Name",
    studentId: "Matrikelnummer",
    program: "Studiengang",
    semester: "Fachsemester",
    enrollmentDate: "Immatrikuliert seit",
    grades: "Noten & Leistungen",
    module: "Modul",
    credits: "ECTS",
    grade: "Note",
    status: "Status",
    passed: "Bestanden",
    gpa: "Durchschnittsnote (GPA)",
    totalCredits: "Gesamt ECTS",
    downloadPassedPdf: "Bestandene Prüfungen (PDF)",
    downloadCompletePdf: "Gesamt Transkript (PDF)",
    issueDate: "Ausstellungsdatum",
    gradeScale: "Notenskala",
    gradeScaleText: "1,0 (sehr gut) bis 5,0 (nicht ausreichend)",
    passedOnly: "Nur bestandene Prüfungen",
    allGrades: "Alle Noten",
    teacher: "Dozent",
    date: "Datum",
  },
  en: {
    title: "Transcript of Records",
    subtitle: "Your academic achievements and grades",
    studentInfo: "Student Information",
    name: "Name",
    studentId: "Student ID",
    program: "Program",
    semester: "Semester",
    enrollmentDate: "Enrolled since",
    grades: "Grades & Performance",
    module: "Module",
    credits: "ECTS",
    grade: "Grade",
    status: "Status",
    passed: "Passed",
    gpa: "Grade Point Average (GPA)",
    totalCredits: "Total ECTS",
    downloadPassedPdf: "Passed Exams (PDF)",
    downloadCompletePdf: "Complete Transcript (PDF)",
    issueDate: "Issue date",
    gradeScale: "Grading Scale",
    gradeScaleText: "1.0 (excellent) to 5.0 (fail)",
    passedOnly: "Passed exams only",
    allGrades: "All grades",
    teacher: "Teacher",
    date: "Date",
  },
};

export const loader = async ({ request }: { request: Request }) => {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return { user: null, marks: [] };
    }

    // Fetch marks specifically for this user
    const marks = await prisma.mark.findMany({
      where: { userId: user.id },
      include: {
        teacher: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Also fetch studiengang info
    const userWithProgram = await prisma.user.findUnique({
      where: { id: user.id },
      include: { studiengang: true },
    });

    return { user: userWithProgram, marks };
  } catch (error) {
    console.error("Error loading transcript data:", error);
    return { user: null, marks: [] };
  }
};

export default function TranscriptPage() {
  const { language } = useLanguage();
  const { user, marks } = useLoaderData<typeof loader>();
  const t = TEXT[language];
  const [showPassedOnly, setShowPassedOnly] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            No user data found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Please log in to view your transcript.
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
  };

  // Filter marks based on toggle
  const displayedMarks = showPassedOnly
    ? marks.filter((m: any) => m.value <= 4.0)
    : marks;

  // Group by semester
  const courseConfigData = getCourseConfig(language);
  const groupedMarks = useMemo(() => {
    const groups: Record<string, typeof marks> = {};
    displayedMarks.forEach((m: any) => {
      const config = courseConfigData.find((c) => c.titleDE === m.course);
      const sem =
        config?.semester ||
        (language === "de" ? "Zusatzmodule" : "Other Modules");
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(m);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [displayedMarks, courseConfigData, language]);

  // Calculate statistics
  const passedMarks = marks.filter((m: any) => m.value <= 4.0);

  const stats = useMemo(() => {
    let totalCredits = 0;
    let weightedSum = 0;

    passedMarks.forEach((m: any) => {
      const config = courseConfigData.find((c) => c.titleDE === m.course);
      const credits = config?.credits || 5;
      totalCredits += credits;
      weightedSum += m.value * credits;
    });

    const gpaVal =
      totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
    return { totalCredits, gpa: gpaVal };
  }, [passedMarks, courseConfigData]);

  const { totalCredits, gpa } = stats;

  const today = new Date().toLocaleDateString(
    language === "de" ? "de-DE" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const downloadPDF = (passedOnly: boolean) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const dataToExport = passedOnly ? passedMarks : marks;

    // Decorative border
    doc.setDrawColor(16, 185, 129); // Emerald
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header with gradient
    doc.setFillColor(16, 185, 129);
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setFillColor(20, 184, 166);
    const GS = (doc as any).GState;
    doc.setGState(new GS({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new GS({ opacity: 1 }));

    // IU Logo
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IU", pageWidth / 2, 30, { align: "center" });

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(passedOnly ? t.passedOnly : t.title, pageWidth / 2, 50, {
      align: "center",
    });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("IU Internationale Hochschule", pageWidth / 2, 57, {
      align: "center",
    });

    // Decorative line
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(40, 65, pageWidth - 40, 65);

    // Student info
    let yPos = 75;
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text(studentData.name, 20, yPos);

    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${t.studentId}: ${studentData.studentId}`, 20, yPos);

    yPos += 5;
    doc.text(studentData.program, 20, yPos);

    // GPA Box
    doc.setFillColor(236, 253, 245); // Emerald-50
    doc.setDrawColor(167, 243, 208); // Emerald-200
    doc.roundedRect(pageWidth - 50, 70, 30, 20, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70);
    doc.text("GPA", pageWidth - 35, 78, { align: "center" });
    doc.setFontSize(16);
    doc.text(gpa, pageWidth - 35, 86, { align: "center" });

    // Table header
    yPos = 100;
    doc.setFillColor(240, 253, 244); // Emerald-50
    doc.rect(15, yPos, pageWidth - 30, 10, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70);
    doc.text(t.module, 20, yPos + 6);
    doc.text(t.grade, pageWidth - 80, yPos + 6);
    doc.text(t.credits, pageWidth - 60, yPos + 6);
    doc.text(t.teacher, pageWidth - 40, yPos + 6);

    // Group dataToExport by semester for PDF
    const groups: Record<string, any[]> = {};
    dataToExport.forEach((m: any) => {
      const config = courseConfigData.find((c) => c.titleDE === m.course);
      const sem =
        config?.semester ||
        (language === "de" ? "Zusatzmodule" : "Other Modules");
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(m);
    });
    const groupedData = Object.entries(groups).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    groupedData.forEach(([semester, semesterMarks]) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 30;
      }

      // Semester Header in PDF
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos - 5, pageWidth - 30, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(semester, 20, yPos);
      yPos += 8;

      semesterMarks.forEach((mark: any) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 30;
        }

        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.text(mark.course, 20, yPos);

        // Grade
        const gradeValue = mark.value.toFixed(1);
        if (mark.value > 4.0) {
          doc.setTextColor(225, 29, 72); // Rose-600
        } else {
          doc.setTextColor(5, 150, 105); // Emerald-600
        }
        doc.text(gradeValue, pageWidth - 80, yPos);

        doc.setTextColor(51, 65, 85);
        doc.text("5 ECTS", pageWidth - 60, yPos);
        doc.text(mark.teacher?.name || "N/A", pageWidth - 40, yPos);

        yPos += 7;
        doc.setDrawColor(241, 245, 249);
        doc.line(15, yPos - 2, pageWidth - 15, yPos - 2);
      });
      yPos += 5;
    });

    // Summary box
    yPos += 10;
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 30;
    }

    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70);
    doc.text(`${t.totalCredits}: ${totalCredits}`, 20, yPos + 8);
    doc.text(`${t.gpa}: ${gpa}`, 20, yPos + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `${dataToExport.length} ${language === "de" ? "Module" : "modules"}`,
      20,
      yPos + 21
    );

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${t.issueDate}: ${today}`, pageWidth / 2, pageHeight - 20, {
      align: "center",
    });
    doc.text(
      "IU Internationale Hochschule GmbH",
      pageWidth / 2,
      pageHeight - 16,
      { align: "center" }
    );
    doc.text("www.iu.de", pageWidth / 2, pageHeight - 12, { align: "center" });

    const filename = passedOnly
      ? `Bestandene_Pruefungen_${studentData.studentId}.pdf`
      : `Transcript_${studentData.studentId}.pdf`;
    doc.save(filename);
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 1.5)
      return "text-iu-blue dark:text-iu-blue bg-iu-blue/10 border border-iu-blue/20";
    if (grade <= 2.5)
      return "text-iu-blue bg-iu-blue/10 border border-iu-blue/20";
    if (grade <= 3.5)
      return "text-iu-orange bg-iu-orange/10 border border-iu-orange/20";
    return "text-iu-red bg-iu-red/10 border border-iu-red/20";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Award size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
              <FileText size={16} />
              <span>OFFICIAL DOCUMENT</span>
            </div>
          </div>
        </div>
      </header>

        {/* Student Info Card */}
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
            <div className="p-3 bg-iu-blue/10 rounded-2xl">
              <User className="h-8 w-8 text-iu-blue" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {t.studentInfo}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background/40 rounded-3xl border border-border/50 hover:border-iu-blue/30 transition-colors group">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest group-hover:text-iu-blue transition-colors">
                {t.name}
              </p>
              <p className="text-xl font-bold text-foreground">
                {studentData.name}
              </p>
            </div>
            <div className="p-6 bg-background/40 rounded-3xl border border-border/50 hover:border-iu-blue/30 transition-colors group">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest group-hover:text-iu-blue transition-colors">
                {t.studentId}
              </p>
              <p className="text-xl font-bold text-foreground">
                {studentData.studentId}
              </p>
            </div>
            <div className="p-6 bg-background/40 rounded-3xl border border-border/50 hover:border-iu-blue/30 transition-colors group">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest group-hover:text-iu-blue transition-colors">
                {t.program}
              </p>
              <p className="text-xl font-bold text-foreground">
                {studentData.program}
              </p>
            </div>
          </div>
        </div>

        {/* GPA Summary */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-iu-blue rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{t.gpa}</h3>
              </div>
              <p className="text-7xl font-black mb-4">{gpa}</p>
              <p className="text-white/80 text-lg font-bold">
                {t.gradeScaleText}
              </p>
            </div>
          </div>

          <div className="bg-iu-purple rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {t.totalCredits}
                </h3>
              </div>
              <p className="text-7xl font-black mb-4">{totalCredits}</p>
              <p className="text-white/80 text-lg font-bold">
                {passedMarks.length}{" "}
                {language === "de" ? "Module bestanden" : "modules passed"}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-2xl">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="font-black text-foreground uppercase tracking-[0.2em] text-sm">
              {showPassedOnly ? t.passedOnly : t.allGrades}
            </span>
          </div>
          <button
            onClick={() => setShowPassedOnly(!showPassedOnly)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-iu-blue focus:ring-offset-2 ${
              showPassedOnly ? "bg-iu-blue" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                showPassedOnly ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Grades Table */}
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-border/50 bg-iu-blue/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-iu-blue/10 rounded-2xl">
                <FileText className="h-8 w-8 text-iu-blue" />
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {t.grades}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {t.module}
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {t.grade}
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {t.credits}
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {t.teacher}
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {t.date}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {groupedMarks.map(
                  ([semester, semesterMarks]: [string, any[]]) => (
                    <React.Fragment key={semester}>
                      <tr className="bg-iu-blue/5">
                        <td
                          colSpan={5}
                          className="px-8 py-4 text-xs font-black text-iu-blue uppercase tracking-[0.3em]"
                        >
                          {semester}
                        </td>
                      </tr>
                      {semesterMarks.map((mark: any) => (
                        <tr
                          key={mark.id}
                          className="hover:bg-iu-blue/5 transition-colors group"
                        >
                          <td className="px-8 py-6 text-base font-bold text-foreground group-hover:text-iu-blue transition-colors">
                            {mark.course}
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${getGradeColor(mark.value)}`}
                            >
                              {mark.value.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
                            5 ECTS
                          </td>
                          <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
                            {mark.teacher?.name || "N/A"}
                          </td>
                          <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
                            {new Date(mark.date).toLocaleDateString(
                              language === "de" ? "de-DE" : "en-US"
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Scale Info */}
        <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-iu-blue/10 rounded-2xl shadow-inner">
              <FileText className="h-8 w-8 text-iu-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">
                {t.gradeScale}
              </h3>
              <p className="font-bold text-muted-foreground text-lg leading-relaxed">
                {t.gradeScaleText}
              </p>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => downloadPDF(true)}
            className="group relative flex items-center justify-center gap-4 bg-iu-blue text-white font-black py-6 px-8 rounded-[2rem] transition-all duration-300 shadow-xl hover:shadow-iu-blue/20 hover:-translate-y-1 text-xl uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <CheckCircle className="h-7 w-7 relative z-10" />
            <span className="relative z-10">{t.downloadPassedPdf}</span>
          </button>
          <button
            onClick={() => downloadPDF(false)}
            className="group relative flex items-center justify-center gap-4 bg-card/60 backdrop-blur-xl border-2 border-iu-blue/30 text-iu-blue font-black py-6 px-8 rounded-[2rem] transition-all duration-300 shadow-xl hover:shadow-iu-blue/10 hover:-translate-y-1 text-xl uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-iu-blue/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Download className="h-7 w-7 relative z-10" />
            <span className="relative z-10">{t.downloadCompletePdf}</span>
          </button>
        </div>
      </div>
    );
}
