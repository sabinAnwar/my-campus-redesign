import React, { useState } from "react";
import { Download, Award, Calendar, User, GraduationCap, TrendingUp, FileText, CheckCircle, Filter } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import jsPDF from "jspdf";

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

export const loader = async () => {
  try {
    const user = await prisma.user.findFirst({
      include: {
        studiengang: true,
        marks: {
          include: {
            teacher: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!user) {
      return { user: null, marks: [] };
    }

    return { user, marks: user.marks };
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">No user data found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Please log in to view your transcript.</p>
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
  };

  // Filter marks based on toggle
  const displayedMarks = showPassedOnly ? marks.filter(m => m.value <= 4.0) : marks;
  
  // Calculate statistics
  const passedMarks = marks.filter(m => m.value <= 4.0);
  const totalCredits = passedMarks.length * 5; // Assuming 5 ECTS per module
  const gpa = passedMarks.length > 0 
    ? (passedMarks.reduce((sum, m) => sum + m.value, 0) / passedMarks.length).toFixed(2)
    : "0.00";

  const today = new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    doc.setGState(new doc.GState({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));

    // IU Logo
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IU", pageWidth / 2, 30, { align: "center" });

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(passedOnly ? t.passedOnly : t.title, pageWidth / 2, 50, { align: "center" });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("IU Internationale Hochschule", pageWidth / 2, 57, { align: "center" });

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

    // Table rows
    yPos += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    dataToExport.forEach((mark, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 30;
      }

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, yPos - 4, pageWidth - 30, 8, "F");
      }

      doc.text(mark.course, 20, yPos);
      
      // Color-coded grade
      const gradeColor = mark.value <= 1.5 ? [16, 185, 129] : 
                        mark.value <= 2.5 ? [59, 130, 246] :
                        mark.value <= 3.5 ? [245, 158, 11] : [239, 68, 68];
      doc.setTextColor(...gradeColor);
      doc.setFont("helvetica", "bold");
      doc.text(mark.value.toFixed(1), pageWidth - 80, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text("5", pageWidth - 60, yPos);
      doc.setFontSize(7);
      doc.text(mark.teacher?.name || "N/A", pageWidth - 40, yPos);
      doc.setFontSize(9);

      yPos += 8;
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
    doc.text(`${dataToExport.length} ${language === "de" ? "Module" : "modules"}`, 20, yPos + 21);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${t.issueDate}: ${today}`, pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.text("IU Internationale Hochschule GmbH", pageWidth / 2, pageHeight - 16, { align: "center" });
    doc.text("www.iu.de", pageWidth / 2, pageHeight - 12, { align: "center" });

    const filename = passedOnly 
      ? `Bestandene_Pruefungen_${studentData.studentId}.pdf`
      : `Transcript_${studentData.studentId}.pdf`;
    doc.save(filename);
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
    if (grade <= 2.5) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
    if (grade <= 3.5) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
              <Award className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">{t.title}</h1>
              <p className="text-emerald-100 mt-2 text-lg">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.studentInfo}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* GPA Summary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-7 w-7" />
              <h3 className="text-xl font-bold">{t.gpa}</h3>
            </div>
            <p className="text-5xl font-black">{gpa}</p>
            <p className="text-emerald-100 mt-3">{t.gradeScaleText}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="h-7 w-7" />
              <h3 className="text-xl font-bold">{t.totalCredits}</h3>
            </div>
            <p className="text-5xl font-black">{totalCredits}</p>
            <p className="text-blue-100 mt-3">{passedMarks.length} {language === "de" ? "Module bestanden" : "modules passed"}</p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <span className="font-semibold text-neutral-900 dark:text-white">
              {showPassedOnly ? t.passedOnly : t.allGrades}
            </span>
          </div>
          <button
            onClick={() => setShowPassedOnly(!showPassedOnly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showPassedOnly ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showPassedOnly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Grades Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t.grades}</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {t.module}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {t.grade}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {t.credits}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {t.teacher}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {t.date}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {displayedMarks.map((mark, idx) => (
                  <tr key={mark.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                      {mark.course}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(mark.value)}`}>
                        {mark.value.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      5 ECTS
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {mark.teacher?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(mark.date).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Scale Info */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-2">{t.gradeScale}</h3>
              <p className="text-emerald-700 dark:text-emerald-300">{t.gradeScaleText}</p>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => downloadPDF(true)}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            <CheckCircle className="h-6 w-6" />
            {t.downloadPassedPdf}
          </button>
          <button
            onClick={() => downloadPDF(false)}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            <Download className="h-6 w-6" />
            {t.downloadCompletePdf}
          </button>
        </div>
      </div>
    </div>
  );
}
