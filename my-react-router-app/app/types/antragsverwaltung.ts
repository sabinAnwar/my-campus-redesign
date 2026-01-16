export interface ApplicationItem {
  id: string;
  titleKey: string;
  status: "new" | "pending" | "approved" | "rejected";
  updatedAt: string;
  info?: boolean;
  categoryKey: string;
}

export interface FormDefinition {
  title: string;
  microsoftFormUrl: string | null;
}

