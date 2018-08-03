export interface Project extends Readonly<{
  name: string;
  slug: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}>{};

export type projectName = string;
export type groupShortNames = string[];

export interface CreateProjectRequest extends Readonly<{
  name: projectName;
  groups: groupShortNames;
}>{};
