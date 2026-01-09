export type Module = {
  code: string;
  title: string;
  semester: number;
  ects: number;
  type: "Pflicht" | "Wahl";
  exam: string;
  workload: number;
  status: "laufend" | "geplant" | "abgeschlossen";
  skills: string[];
  description: string;
};

export type ModuleHandbookLoaderData = {
  courses: Array<{
    id: number;
    code: string;
    name: string;
    name_de?: string | null;
    name_en?: string | null;
    description: string | null;
    credits: number;
    semester: number;
    major?: { name: string } | null;
  }>;
  marks: Array<{
    id: number;
    value: number;
    course: string;
  }>;
  currentSemester: number;
  studiengangName: string | null;
  error?: string | null;
};
