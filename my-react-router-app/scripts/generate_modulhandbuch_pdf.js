
import { jsPDF } from "jspdf";
import fs from "fs";

// Configuration
const OUTPUT_PATH = "./public/uploads/modulhandbuch-winfo.pdf";
const PROGRAM_NAME = "B.Sc. Wirtschaftsinformatik (Dual)";
const STUDENT_NAME = "Demo Student";

// Mocking the data from app/constants/module-handbook.ts (since we can't import TS in simple node script easily without setup)
const COURSE_META = {
  "WI-101": { ects: 6, exam: "Klausur (120 Min)", semester: 1, type: "Pflicht", workload: 150, description: "Grundlagen der Softwareentwicklung mit Fokus auf wartbare Architektur, Versionskontrolle und Testautomatisierung." },
  "WI-102": { ects: 5, exam: "Klausur (90 Min)", semester: 1, type: "Pflicht", workload: 125, description: "Mathematische Werkzeuge fuer datengetriebene Entscheidungen und erste Schritte in der explorativen Datenanalyse." },
  "WI-201": { ects: 6, exam: "Projekt + Fachgespraech", semester: 2, type: "Pflicht", workload: 150, description: "Relationale Modellierung, Normalformen, Query-Optimierung und API-Anbindung mit praxisnahen Cases." },
  "WI-202": { ects: 5, exam: "Hausarbeit", semester: 2, type: "Pflicht", workload: 125, description: "Steuerung von IT-Landschaften, Service-Management und Risikobetrachtung fuer digitale Transformation." },
  "WI-301": { ects: 6, exam: "Case Study + Praesentation", semester: 3, type: "Wahl", workload: 150, description: "Analytische Auswertung von Prozessen, KPI-Design und Visualisierung datenbasierter Handlungsempfehlungen." },
  "WI-302": { ects: 6, exam: "Projekt (CI/CD Pipeline)", semester: 3, type: "Wahl", workload: 150, description: "Deployment-Strategien, Observability und Automatisierung fuer skalierbare Anwendungen in der Cloud." },
  "WI-401": { ects: 6, exam: "Portfolio + Viva", semester: 4, type: "Wahl", workload: 150, description: "Modellierung, Evaluierung und Operationalisierung von ML-Loesungen mit Fokus auf Business Impact." },
  "WI-701": { ects: 12, exam: "Bachelorarbeit + Kolloquium (60 Min)", semester: 7, type: "Pflicht", workload: 360, description: "Eigenstaendige wissenschaftliche Arbeit mit Kolloquium, Themenfokus Wirtschaftsinformatik." },
  "WI-702": { ects: 8, exam: "Projektbericht + Praesentation", semester: 7, type: "Pflicht", workload: 200, description: "Praxisprojekt mit Unternehmensbezug, Abschluss durch schriftlichen Bericht und Praesentation." }
};

const TITLES = {
  "WI-101": "Programmierung & Software Engineering I",
  "WI-102": "Statistik & Data Science I",
  "WI-201": "Datenbankmanagement & APIs",
  "WI-202": "IT-Governance & Compliance",
  "WI-301": "Data & Process Analytics",
  "WI-302": "Cloud Architekturen & DevOps",
  "WI-401": "Advanced Analytics & ML",
  "WI-701": "Bachelor Thesis",
  "WI-702": "Praxis-Transferprojekt VII"
};

const doc = new jsPDF();

// Helper for UI colors
const colors = {
  blue: [36, 94, 235],
  pink: [254, 77, 249],
  orange: [255, 169, 51],
  dark: [29, 29, 31],
  gray: [100, 100, 100],
  lightGray: [243, 243, 245]
};

const addPageFrame = () => {
  doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, 200, 287);
  
  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.text(`Seite ${doc.internal.getNumberOfPages()} | MyCampus Modulhandbuch | ${PROGRAM_NAME}`, 105, 285, { align: "center" });
};

// --- COVER PAGE ---
addPageFrame();
// Header bar
doc.setFillColor(colors.blue[0], colors.blue[1], colors.blue[2]);
doc.rect(0, 0, 210, 45, "F");

// Logo Text
doc.setTextColor(255, 255, 255);
doc.setFontSize(26);
doc.setFont("helvetica", "bold");
doc.text("IU", 15, 25);
doc.setFontSize(14);
doc.setFont("helvetica", "normal");
doc.text("INTERNATIONALE HOCHSCHULE", 15, 35);

// Title
doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
doc.setFontSize(42);
doc.setFont("helvetica", "bold");
doc.text("MODUL", 15, 90);
doc.text("HANDBUCH", 15, 110);

// Accent Line
doc.setFillColor(colors.pink[0], colors.pink[1], colors.pink[2]);
doc.rect(15, 120, 150, 2, "F");

// Subtitle
doc.setFontSize(22);
doc.setTextColor(colors.blue[0], colors.blue[1], colors.blue[2]);
doc.text(PROGRAM_NAME, 15, 140);

// Info details
doc.setFontSize(12);
doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
doc.setFont("helvetica", "normal");
doc.text(`Studierender: ${STUDENT_NAME}`, 15, 170);
doc.text(`Track: Data & Process Management`, 15, 178);
doc.text(`Stand: Januar 2026`, 15, 186);

// Visual decoration
doc.setDrawColor(colors.orange[0], colors.orange[1], colors.orange[2]);
doc.setLineWidth(10);
doc.line(200, 60, 200, 250);

// --- TABLE OF CONTENTS ---
doc.addPage();
addPageFrame();
doc.setFillColor(colors.blue[0], colors.blue[1], colors.blue[2]);
doc.rect(15, 25, 180, 10, "F");
doc.setTextColor(255, 255, 255);
doc.setFontSize(16);
doc.setFont("helvetica", "bold");
doc.text("Inhaltsverzeichnis", 20, 32);

doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
doc.setFontSize(11);
let y = 50;
Object.entries(TITLES).forEach(([code, title], index) => {
  doc.setFont("helvetica", "bold");
  doc.text(`${code}:`, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${title}`, 45, y);
  doc.text(`Semester ${COURSE_META[code].semester}`, 160, y);
  
  // Dotted line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  doc.line(20, y + 2, 190, y + 2);
  
  y += 12;
});

// --- MODULE PAGES ---
Object.entries(COURSE_META).forEach(([code, data]) => {
  doc.addPage();
  addPageFrame();
  
  // Module Header
  doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.rect(15, 20, 180, 25, "F");
  
  doc.setTextColor(colors.blue[0], colors.blue[1], colors.blue[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(code, 20, 30);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  doc.setFontSize(18);
  doc.text(TITLES[code], 20, 40);
  
  // Details Grid
  y = 60;
  doc.setFontSize(10);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  
  const grid = [
    ["ECTS-Punkte", `${data.ects} CP`],
    ["Workload", `${data.workload} Stunden`],
    ["Semester", `${data.semester}. Semester`],
    ["Prüfungsform", data.exam],
    ["Typ", data.type]
  ];
  
  grid.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, y);
    y += 8;
  });
  
  // Description
  y += 10;
  doc.setFillColor(colors.pink[0], colors.pink[1], colors.pink[2]);
  doc.rect(15, y, 3, 10, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Modulbeschreibung", 22, y + 7);
  
  y += 15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitDesc = doc.splitTextToSize(data.description, 170);
  doc.text(splitDesc, 20, y);
  
  // Visual separator
  doc.setDrawColor(colors.blue[0], colors.blue[1], colors.blue[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 260, 195, 260);
});

// Output
const buffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(OUTPUT_PATH, buffer);

console.log(` Modulhandbuch PDF wurde erfolgreich unter ${OUTPUT_PATH} gespeichert.`);
