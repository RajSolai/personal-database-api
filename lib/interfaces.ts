
export interface ProjectDataBase {
  id: string;
  name: string;
  description: string;
  type: string;
  body: object;
}

// TODO : implement tables
export interface TableDataBase {
  name: string;
  description: string;
  type: string;
  body: Map<string, Array<String>>;
}
