import { TRANSLATIONS } from "~/services/translations/antragsverwaltung";
import type { ApplicationItem } from "~/types/antragsverwaltung";

export { TRANSLATIONS };

export const getFormDefinitions = (t: typeof TRANSLATIONS.de) => {
  const defaultUrl =
    "https://forms.office.com/pages/responsepage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUMzY5QlNXSVBNREVIWkZJNkJRREVYMDkyWC4u&route=shorturl";

  const definitions: Record<string, any> = {
    "1": {
      title: t.itemTitles["1"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUMzY5QlNXSVBNREVIWkZJNkJRREVYMDkyWC4u",
    },
    "2": {
      title: t.itemTitles["2"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUOUFWWUhBUzI4TURDMlM5M0FXWEZZTTJLNS4u",
    },
    "13": {
      title: t.itemTitles["13"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxURTZJRkFCMVMzMTAxVDRJV0NXQ00xT0JCUi4u",
    },
    "5": {
      title: t.itemTitles["5"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxURUw2TVIzNTBYRE9RV0lSTFpPRjhOR09ZQS4u",
    },
    "12": {
      title: t.itemTitles["12"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUNDlZS0xRQldPNElZVzA1NU1BMFFEN0pSQS4u",
    },
    "7": {
      title: t.itemTitles["7"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUOTVDQVRCMkNXSkxQMVJETTlYVTE0VUMzNC4u",
    },
    "8": {
      title: t.itemTitles["8"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUQU40R09ZVkJZS1pJMDNWUFJHTVJOODY3MS4u",
    },
    "3": {
      title: t.itemTitles["3"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUNDFGRlo3UUNXVk1VN1pCOUs3S1lORUxXQi4u",
    },
    "11": {
      title: t.itemTitles["11"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUNFFHVEUwTTlHNEsxWTJCWU1BNVpNSTlZNS4u",
    },
    "9": {
      title: t.itemTitles["9"],
      microsoftFormUrl:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=_skZ9LD3h02-6OjfshkMq7F2PQ6rY6BIklzo_Enz5dxUN0hUTTVUSDZVN05QWENTTE5YNFEzTzE0VS4u",
    },
    default: {
      title: t.formLabels.generalApplication,
      microsoftFormUrl: defaultUrl,
    },
  };

  // Populate remaining definitions (skip 1, 2, 3, 5, 7, 8, 9, 11, 12, 13 as they have custom URLs)
  for (let i = 4; i <= 17; i++) {
    if (i === 5 || i === 7 || i === 8 || i === 9 || i === 11 || i === 12 || i === 13) continue;
    const id = i.toString();
    definitions[id] = {
      title: t.itemTitles[id as keyof typeof t.itemTitles],
      microsoftFormUrl: defaultUrl,
    };
  }

  return definitions;
};;

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
