import type {
  GradeStatusKey as StatusKey,
  GradeSection as Section,
} from "~/types/grades";



export const STUDENT_DATA = {
  vorname: "Demo Student",
  name: "El Anwar",
  matrikelnummer: "102203036",
  studiengang: "Wirtschaftsinformatik (HH-BA-WINFO-WiSe-22-GTW)",
  gesamtDurchschnitt: 1.58,
};

export const SEMESTERS: Section[] = [
  {
    name: "1. Semester",
    modules: [
      {
        name: "Grundlagen der BWL",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "31.03.2023",
      },
      {
        name: "Mathematik I",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "21.02.2023",
      },
      {
        name: "Industrielle Softwaretechnik (MP)",
        status: "P",
        note: 2.0,
        credits: 5,
        datum: "16.02.2023",
      },
      {
        name: "Wissenschaftliches Arbeiten",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "26.03.2023",
      },
      {
        name: "Praxisprojekt I",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "29.06.2023",
      },
    ],
  },
  {
    name: "2. Semester",
    modules: [
      {
        name: "Buchführung und Jahresabschluss",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "21.08.2023",
        bewertung: "90/100",
      },
      {
        name: "Mathematik Grundlagen II",
        status: "P",
        note: 4.0,
        credits: 5,
        datum: "25.08.2023",
        bewertung: "51.11/100",
      },
      {
        name: "Objektorientierte Programmierung I",
        status: "P",
        note: 2.7,
        credits: 5,
        datum: "18.08.2023",
        bewertung: "84.3/90",
      },
      {
        name: "Fallstudie Digitale Business Modelle",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "20.07.2023",
        bewertung: "89/100",
      },
      {
        name: "Praxisprojekt II",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "24.10.2023",
        bewertung: "100/100",
      },
    ],
  },
  {
    name: "3. Semester",
    modules: [
      {
        name: "Kosten- und Leistungsrechnung",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "06.02.2024",
        bewertung: "91.11/100",
      },
      {
        name: "Marketing",
        status: "P",
        note: 2.0,
        credits: 5,
        datum: "–",
        bewertung: "81/100",
      },
      {
        name: "Requirement Engineering (MP)",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "14.02.2024",
        bewertung: "70.5/90",
      },
      {
        name: "Praxisprojekt III",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "30.03.2024",
        bewertung: "86.4/80",
      },
      {
        name: "Objektorientierte Programmierung II",
        status: "P",
        note: 2.3,
        credits: 5,
        datum: "–",
        bewertung: "76/100",
      },
    ],
  },
  {
    name: "4. Semester",
    modules: [
      {
        name: "Datenschutz und IT-Sicherheit (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "15.08.2024",
        bewertung: "87/90",
      },
      {
        name: "Fallstudie Software-Engineering (MP)",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "–",
        bewertung: "91.3/100",
      },
      {
        name: "IT-Consulting & Dienstleistungsmanagement",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "30.09.2024",
        bewertung: "81/90",
      },
      {
        name: "Praxisprojekt IV",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "01.10.2024",
        bewertung: "97/100",
      },
      {
        name: "Qualitätssicherung im Softwareprozess (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "–",
        bewertung: "96.25/100",
      },
    ],
  },
  {
    name: "5. Semester",
    modules: [
      {
        name: "Data Analytics und Big Data (MP)",
        status: "P",
        note: 1.0,
        credits: 5,
        datum: "–",
        bewertung: "96/100",
      },
      {
        name: "Design Thinking",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "–",
        bewertung: "91/100",
      },
      {
        name: "Betriebssysteme, Rechnernetze & verteilte Systeme",
        status: "P",
        note: 1.7,
        credits: 5,
        datum: "11.02.2025",
        bewertung: "78/90",
      },
      {
        name: "Praxisprojekt V",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "01.04.2025",
        bewertung: "91/100",
      },
    ],
  },
  {
    name: "6. Semester",
    modules: [
      {
        name: "IT-Architekturmanagement",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "21.08.2025",
        bewertung: "93.33/100",
      },
      {
        name: "Planen und Entscheiden",
        status: "P",
        note: 1.3,
        credits: 5,
        datum: "31.07.2025",
        bewertung: "92/100",
      },
      {
        name: "Praxisprojekt VI",
        status: "E",
        note: null,
        credits: 5,
        datum: "29.09.2025",
        bewertung: "Bewertung folgt",
      },
    ],
  },
  {
    name: "7. Semester",
    modules: [
      { name: "E-Commerce", status: "CE", note: null, credits: 5, datum: "–" },
      {
        name: "Personal- und Unternehmensführung",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
      {
        name: "Unternehmensgründung & Innovationsmanagement",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
      {
        name: "Bachelorarbeit",
        status: "M",
        note: null,
        credits: 10,
        datum: "–",
      },
      {
        name: "Praxisberichte VII",
        status: "CE",
        note: null,
        credits: 5,
        datum: "–",
      },
    ],
  },
];

export const VERTIEFUNG_DATA_ANALYTICS: Section = {
  name: "Vertiefung: Data Analytics",
  modules: [
    {
      name: "Algorithmen, Datenstrukturen & Programmiersprachen I",
      status: "P",
      note: 1.7,
      credits: 5,
      datum: "19.08.2025",
    },
    { name: "… Fallstudie", status: "CE", note: null, credits: 5, datum: "–" },
    {
      name: "Business Intelligence I",
      status: "P",
      note: 1.3,
      credits: 5,
      datum: "–",
      bewertung: "92/100",
    },
    {
      name: "Business Intelligence II",
      status: "P",
      note: 1.0,
      credits: 5,
      datum: "01.08.2025",
      bewertung: "100/100",
    },
  ],
};

export const ZUSATZ_MODULE: Section = {
  name: "Zusatzmodule & Projekte",
  modules: [
    {
      name: "Projekt: KI-Exzellenz mit kreativen Prompt-Techniken",
      status: "P",
      note: 1.0,
      credits: 5,
      datum: "23.02.2025",
      bewertung: "100/100",
    },
    {
      name: "Artificial Intelligence (Wahlbereich)",
      status: "M",
      note: null,
      credits: 5,
      datum: "–",
    },
  ],
};

export const CHIP_CLASSES: Record<StatusKey, string> = {
  P: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  F: "bg-iu-red/10 text-iu-red ring-1 ring-iu-red/20",
  M: "bg-iu-orange/10 text-iu-orange ring-1 ring-iu-orange/20",
  CE: "bg-iu-blue/10 text-iu-blue ring-1 ring-iu-blue/20",
  E: "bg-iu-purple/10 text-iu-purple ring-1 ring-iu-purple/20",
};

export const CHIP_LABEL: Record<StatusKey, string> = {
  P: "Bestanden",
  F: "Nicht bestanden",
  M: "Offen",
  CE: "Angemeldet",
  E: "Zur Prüfung angemeldet",
};
