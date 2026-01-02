import {
  BarChart3,
  Code2,
  FolderKanban,
} from "lucide-react";

import type { Vertiefung, VertiefungId } from "~/types/specialization";

// Re-export translations from the centralized translations service
export { TRANSLATIONS } from "~/services/translations/specialization";

// ============================================================================
// Specialization Data (Non-translatable static configuration)
// ============================================================================

export const VERTIEFUNGEN: Record<VertiefungId, Vertiefung> = {
  datenanalyse: {
    id: "datenanalyse",
    name: "Datenanalyse",
    nameEn: "Data Analytics",
    icon: BarChart3,
    color: "emerald",
    gradient: "from-emerald-500 to-iu-blue",
    darkGradient: "from-emerald-500/80 to-iu-blue/80",
    description:
      "Transformiere Daten in wertvolle Erkenntnisse. Lerne Big Data, Machine Learning und Business Intelligence.",
    highlights: [
      "Big Data & Cloud Analytics",
      "Machine Learning Algorithmen",
      "Business Intelligence Tools",
      "Datenvisualisierung",
    ],
    courses: [
      {
        id: "da-101",
        code: "DLBDSEDA01",
        name: "Einführung in die Datenanalyse",
        credits: 5,
        semester: 5,
        description:
          "Grundlagen der explorativen Datenanalyse, Datenvisualisierung und statistische Methoden.",
        topics: [
          "Datenaufbereitung",
          "Explorative Analyse",
          "Visualisierung",
          "Statistische Tests",
        ],
      },
      {
        id: "da-102",
        code: "DLBDSABD01",
        name: "Big Data Technologies",
        credits: 5,
        semester: 5,
        description:
          "Verteilte Datenverarbeitung mit Hadoop, Spark und modernen Cloud-Plattformen.",
        topics: ["Hadoop", "Apache Spark", "Cloud Analytics", "Data Lakes"],
      },
      {
        id: "da-201",
        code: "DLBDSEAIS01",
        name: "Machine Learning",
        credits: 5,
        semester: 6,
        description:
          "Anwendung von Machine Learning Algorithmen für Vorhersagen und Mustererkennung.",
        topics: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Neural Networks",
          "Feature Engineering",
        ],
      },
      {
        id: "da-202",
        code: "DLBDSABI01",
        name: "Business Intelligence & Reporting",
        credits: 5,
        semester: 6,
        description:
          "BI-Tools, Dashboard-Design und unternehmensweite Reporting-Strategien.",
        topics: ["Power BI", "Tableau", "KPIs", "Self-Service BI"],
      },
    ],
    careerPaths: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Scientist",
      "Analytics Consultant",
    ],
  },
  softwareengineering: {
    id: "softwareengineering",
    name: "Software Engineering",
    nameEn: "Software Engineering",
    icon: Code2,
    color: "iu-blue",
    gradient: "from-iu-blue to-iu-purple",
    darkGradient: "from-iu-blue/80 to-iu-purple/80",
    description:
      "Entwickle professionelle Software mit modernen Methoden. Von Clean Code bis Cloud-native Architektur.",
    highlights: [
      "Moderne Softwaremethodik",
      "Clean Architecture & DDD",
      "DevOps & CI/CD",
      "Cloud Engineering",
    ],
    courses: [
      {
        id: "se-101",
        code: "DLBCSESWM01",
        name: "Moderne Softwaremethodik",
        credits: 5,
        semester: 5,
        description:
          "Agile Methoden, Scrum, Kanban und modernes Requirements Engineering.",
        topics: ["Scrum", "Kanban", "User Stories", "Continuous Improvement"],
      },
      {
        id: "se-102",
        code: "DLBCSETEST01",
        name: "Software Testing & Qualitätssicherung",
        credits: 5,
        semester: 5,
        description:
          "Unit Tests, Integration Tests, TDD und automatisierte Testframeworks.",
        topics: [
          "Unit Testing",
          "Integration Testing",
          "TDD/BDD",
          "Test Automation",
        ],
      },
      {
        id: "se-201",
        code: "DLBCSESWA01",
        name: "Softwarearchitektur",
        credits: 5,
        semester: 6,
        description:
          "Architekturpatterns, Microservices, Domain-Driven Design und Systemdesign.",
        topics: [
          "Microservices",
          "Clean Architecture",
          "DDD",
          "Design Patterns",
        ],
      },
      {
        id: "se-202",
        code: "DLBCSEDEVOPS01",
        name: "DevOps & Cloud Engineering",
        credits: 5,
        semester: 6,
        description:
          "CI/CD Pipelines, Container-Orchestrierung und Cloud-native Entwicklung.",
        topics: ["Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
      },
    ],
    careerPaths: [
      "Software Developer",
      "DevOps Engineer",
      "Software Architect",
      "Full-Stack Developer",
    ],
  },
  projektmanagement: {
    id: "projektmanagement",
    name: "Projektmanagement",
    nameEn: "Project Management",
    icon: FolderKanban,
    color: "iu-orange",
    gradient: "from-iu-orange to-iu-red",
    darkGradient: "from-iu-orange/80 to-iu-red/80",
    description:
      "Führe IT-Projekte zum Erfolg. Agile Methoden, Risikomanagement und strategische Portfoliosteuerung.",
    highlights: [
      "Agiles & Hybrides PM",
      "Risikomanagement",
      "Portfolio Management",
      "Stakeholder Analyse",
    ],
    courses: [
      {
        id: "pm-101",
        code: "DLBPMITPM01",
        name: "IT-Projektmanagement Grundlagen",
        credits: 5,
        semester: 5,
        description:
          "Projektplanung, Steuerung und Kontrolle von IT-Projekten.",
        topics: [
          "Projektplanung",
          "Meilensteine",
          "Gantt-Charts",
          "Projektkontrolle",
        ],
      },
      {
        id: "pm-102",
        code: "DLBPMARM01",
        name: "Agiles & Hybrides Projektmanagement",
        credits: 5,
        semester: 5,
        description:
          "Kombination klassischer und agiler Methoden für flexible Projektführung.",
        topics: ["Hybrid PM", "Scaled Agile", "SAFe", "Lean Management"],
      },
      {
        id: "pm-201",
        code: "DLBPMRISK01",
        name: "Risiko- und Qualitätsmanagement",
        credits: 5,
        semester: 6,
        description:
          "Identifikation, Bewertung und Steuerung von Projektrisiken.",
        topics: [
          "Risikoanalyse",
          "Qualitätskontrolle",
          "FMEA",
          "Stakeholder Analyse",
        ],
      },
      {
        id: "pm-202",
        code: "DLBPMPMO01",
        name: "Portfolio- und Programmmanagement",
        credits: 5,
        semester: 6,
        description:
          "Strategisches Management mehrerer Projekte und PMO-Aufbau.",
        topics: [
          "Portfoliomanagement",
          "PMO Setup",
          "Strategic Alignment",
          "Benefits Realization",
        ],
      },
    ],
    careerPaths: [
      "IT Project Manager",
      "Scrum Master",
      "Product Owner",
      "PMO Lead",
    ],
  },
};
