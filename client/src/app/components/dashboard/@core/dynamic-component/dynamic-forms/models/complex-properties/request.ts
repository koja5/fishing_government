import { ConfigurationFile } from "./configuration-file";

export interface Request {
  type: string;
  api: string;
  parametars?: any[];
  fields: any;
  root?: string;
  localData?: ConfigurationFile;
  parametarsDate: any;
}
