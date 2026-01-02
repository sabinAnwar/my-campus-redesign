import { jsPDF } from "jspdf";
import type { TranscriptStudentData, MarkWithTeacher } from "~/types/transcript";

export const generateTranscriptPDF = (
  t: any,
  studentData: TranscriptStudentData,
  marks: MarkWithTeacher[],
  stats: { totalCredits: number; gpa: string },
  today: string,
  language: string,
  passedOnly: boolean,
  courseConfigData: any[]
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { totalCredits, gpa } = stats;

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
  if (GS) {
    doc.setGState(new GS({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new GS({ opacity: 1 }));
  }

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

  // Group marks by semester
  const groups: Record<string, any[]> = {};
  marks.forEach((m: any) => {
    const config = courseConfigData.find((c) => c.titleDE === m.course);
    const sem = config?.semester || (language === "de" ? "Zusatzmodule" : "Other Modules");
    if (!groups[sem]) groups[sem] = [];
    groups[sem].push(m);
  });
  const groupedData = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));

  yPos += 15;
  groupedData.forEach(([semester, semesterMarks]) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
    }

    // Semester Header
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
  doc.text(`${marks.length} ${language === "de" ? "Module" : "modules"}`, 20, yPos + 21);

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
