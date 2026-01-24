//
// Student ID Constants
// Re-exports translations from services/translations for backwards compatibility
//

// Re-export translations from the centralized translations service
export { TRANSLATIONS as STUDENT_ID_TRANSLATIONS } from "~/services/translations/student-id";

// Type alias for backwards compatibility
export type StudentIdTranslations =
  typeof import("~/services/translations/student-id").TRANSLATIONS.de;
