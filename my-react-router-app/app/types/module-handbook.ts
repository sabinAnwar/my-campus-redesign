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
    description: string | null;
    studiengang?: { name: string } | null;
  }>;
  studiengangName: string | null;
};
