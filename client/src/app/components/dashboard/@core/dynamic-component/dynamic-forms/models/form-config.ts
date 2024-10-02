import { RequestModel } from "app/components/dashboard/models/request-model";
import { FieldConfig } from "./field-config";
import { FieldsWithAdditionalInfo } from "./fields-with-additional-info";

export class FormConfig {
  actionButtons?: any;
  request?: RequestModel;
  editSettingsRequest?: any;
  additionalInfo?: FieldsWithAdditionalInfo;
  config?: FieldConfig[];
  childrens?: FormConfig[];
  class?: string;
}
