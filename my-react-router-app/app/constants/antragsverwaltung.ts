import { TRANSLATIONS } from "~/services/translations/antragsverwaltung";
import type { ApplicationItem } from "~/types/antragsverwaltung";

export { TRANSLATIONS };

export const getFormDefinitions = (t: typeof TRANSLATIONS.de) => ({
  "1": {
    title: t.itemTitles["1"],
    fields: [
      {
        name: "studentName",
        label: t.formLabels.name,
        type: "text",
        required: true,
      },
      {
        name: "matrikelNummer",
        label: t.formLabels.matriculationNumber,
        type: "text",
        required: true,
      },
      {
        name: "thesisTitle",
        label: t.formLabels.thesisTitle,
        type: "text",
        required: true,
      },
      {
        name: "supervisor",
        label: t.formLabels.supervisor,
        type: "text",
        required: true,
      },
      {
        name: "company",
        label: t.formLabels.company,
        type: "text",
        required: false,
      },
      {
        name: "startDate",
        label: t.formLabels.desiredStartDate,
        type: "date",
        required: true,
      },
      {
        name: "documents",
        label: t.formLabels.uploadDocuments,
        type: "file",
        required: false,
      },
    ],
    microsoftFormUrl: "https://forms.office.com/e/z0xk9ttuJY",
  },
  "2": {
    title: t.itemTitles["2"],
    fields: [
      {
        name: "studentName",
        label: t.formLabels.name,
        type: "text",
        required: true,
      },
      {
        name: "matrikelNummer",
        label: t.formLabels.matriculationNumber,
        type: "text",
        required: true,
      },
      {
        name: "disability",
        label: t.formLabels.impairmentType,
        type: "textarea",
        required: true,
      },
      {
        name: "requestedAccommodation",
        label: t.formLabels.requestedMeasures,
        type: "textarea",
        required: true,
      },
      {
        name: "medicalCertificate",
        label: t.formLabels.medicalCertificate,
        type: "file",
        required: true,
      },
    ],
    microsoftFormUrl:
      "https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID_2",
  },
  "3": {
    title: t.itemTitles["3"],
    fields: [
      {
        name: "studentName",
        label: t.formLabels.name,
        type: "text",
        required: true,
      },
      {
        name: "matrikelNummer",
        label: t.formLabels.matriculationNumber,
        type: "text",
        required: true,
      },
      {
        name: "currentDeadline",
        label: t.formLabels.currentDeadline,
        type: "date",
        required: true,
      },
      {
        name: "requestedExtension",
        label: t.formLabels.requestedExtension,
        type: "number",
        required: true,
      },
      {
        name: "reason",
        label: t.formLabels.reason,
        type: "textarea",
        required: true,
      },
      {
        name: "supportingDocuments",
        label: t.formLabels.supportingDocuments,
        type: "file",
        required: false,
      },
    ],
    microsoftFormUrl:
      "https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID_3",
  },
  default: {
    title: t.formLabels.generalApplication,
    fields: [
      {
        name: "studentName",
        label: t.formLabels.name,
        type: "text",
        required: true,
      },
      {
        name: "matrikelNummer",
        label: t.formLabels.matriculationNumber,
        type: "text",
        required: true,
      },
      {
        name: "requestDetails",
        label: t.formLabels.requestDetails,
        type: "textarea",
        required: true,
      },
      {
        name: "documents",
        label: t.formLabels.documents,
        type: "file",
        required: false,
      },
    ],
    microsoftFormUrl: null,
  },
});

export const MOCK_ITEMS: ApplicationItem[] = [
  {
    id: "1",
    titleKey: "1",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "2",
    titleKey: "2",
    status: "pending",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "3",
    titleKey: "3",
    status: "approved",
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "4",
    titleKey: "4",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "5",
    titleKey: "5",
    status: "pending",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "6",
    titleKey: "6",
    status: "rejected",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "7",
    titleKey: "7",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "8",
    titleKey: "8",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "9",
    titleKey: "9",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "10",
    titleKey: "10",
    status: "approved",
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    info: true,
    categoryKey: "examOffice",
  },
  {
    id: "11",
    titleKey: "11",
    status: "pending",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "12",
    titleKey: "12",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "studentOffice",
  },
  {
    id: "13",
    titleKey: "13",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "studentOffice",
  },
  {
    id: "14",
    titleKey: "14",
    status: "pending",
    updatedAt: new Date().toISOString(),
    info: true,
    categoryKey: "studentOffice",
  },
  {
    id: "15",
    titleKey: "15",
    status: "pending",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "16",
    titleKey: "16",
    status: "approved",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "17",
    titleKey: "17",
    status: "pending",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
];
