import { jsPDF } from "jspdf";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

export const generateImmatriculationPDF = (
  t: any,
  studentData: ImmatriculationStudentData,
  today: string
) => {
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

  // Header with gradient effect
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(15, 15, pageWidth - 30, 25, "F");
  doc.setFillColor(139, 92, 246); // Violet overlay
  const GS = (doc as any).GState;
  if (GS) {
    doc.setGState(new GS({ opacity: 0.3 }));
    doc.rect(15, 15, pageWidth - 30, 25, "F");
    doc.setGState(new GS({ opacity: 1 }));
  }

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
  doc.text(t.signature, pageWidth - 55, yPos + 5, { align: "center" });

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
