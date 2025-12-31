export type ModuleFile = {
  id: number;
  name: string;
  size: string;
  date: string;
  moduleId?: number;
  moduleName?: string;
  fileType?: string;
  type?: string;
  url?: string | null;
  studiengang?: string | null;
};

export type RecentFileEntry = {
  id: number;
  name: string;
  fileType: string | null;
  url: string | null;
  moduleName: string | null;
  studiengang: string | null;
  at: number;
};
