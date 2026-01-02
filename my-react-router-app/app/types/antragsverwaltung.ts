export interface ApplicationItem {
  id: string;
  titleKey: string;
  status: "pending" | "approved" | "rejected";
  updatedAt: string;
  info?: boolean;
  categoryKey: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "date" | "textarea" | "file" | "number";
  required: boolean;
}

export interface FormDefinition {
  title: string;
  fields: FormField[];
  microsoftFormUrl: string | null;
}
