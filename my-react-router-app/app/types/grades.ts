export type GradeStatusKey = "P" | "F" | "M" | "CE" | "E";

export interface GradeModule {
  name: string;
  status: GradeStatusKey;
  note: number | null;
  credits: number;
  datum: string;
  bewertung?: string;
}

export interface GradeSection {
  name: string;
  modules: GradeModule[];
}
