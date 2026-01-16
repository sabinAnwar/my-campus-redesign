import { TRANSLATIONS } from "~/services/translations/antragsverwaltung";
import type { ApplicationItem } from "~/types/antragsverwaltung";

export { TRANSLATIONS };

export const getFormDefinitions = (t: typeof TRANSLATIONS.de) => {
  const defaultUrl = "https://forms.office.com/pages/responsepage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUMzY5QlNXSVBNREVIWkZJNkJRREVYMDkyWC4u&route=shorturl";
  
  const definitions: Record<string, any> = {
    "1": {
      title: t.itemTitles["1"],
      microsoftFormUrl: "https://forms.office.com/e/z0xk9ttuJY",
    },
    default: {
      title: t.formLabels.generalApplication,
      microsoftFormUrl: defaultUrl,
    },
  };

  // Populate all definitions from 2 to 17
  for (let i = 2; i <= 17; i++) {
    const id = i.toString();
    definitions[id] = {
      title: t.itemTitles[id as keyof typeof t.itemTitles],
      microsoftFormUrl: defaultUrl,
    };
  }

  return definitions;
};

export const MOCK_ITEMS: ApplicationItem[] = [
  {
    id: "1",
    titleKey: "1",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "2",
    titleKey: "2",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "3",
    titleKey: "3",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "4",
    titleKey: "4",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "5",
    titleKey: "5",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "6",
    titleKey: "6",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "7",
    titleKey: "7",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "8",
    titleKey: "8",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "9",
    titleKey: "9",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "10",
    titleKey: "10",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "11",
    titleKey: "11",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "examOffice",
  },
  {
    id: "12",
    titleKey: "12",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "13",
    titleKey: "13",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "14",
    titleKey: "14",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "15",
    titleKey: "15",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "16",
    titleKey: "16",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
  {
    id: "17",
    titleKey: "17",
    status: "new",
    updatedAt: new Date().toISOString(),
    categoryKey: "studentOffice",
  },
];
