import { Dispatch, SetStateAction } from "react";

export interface DrawerHeaderType {
  action: string;
  reportName?: string;
  handleBack: () => void;
}

export interface DrawerFormType {
  fields: FieldsType;
  fieldsError: FieldsErrorType;
  reportFrequencyDropdown: OptionType[];
  reportGroupDropdown: OptionType[];
  typicalSourceDropdown: OptionType[];
  securityRiskDropdown: OptionType[];
  applicableToTPARequestDropdown: OptionType[];
  urlNameGroupingDropdown: OptionType[];
  relevanttoRACsDropdown: OptionType[];
  auditEvidenceDropdown: OptionType[];
  usersofReportDropdown: OptionType[];
  handleForm: (event: any, record?: any) => void;
  handleFieldsState: Dispatch<SetStateAction<FieldsType>>;
  handleFieldErrorsState: Dispatch<SetStateAction<FieldsErrorType>>;
}

export interface DrawerFooterType {
  onSave: () => void;
  onCancel: () => void;
}

export interface FieldsType {
  reportId: number | null;
  reportName: string;
  reportNumber: string | number;
  reportFrequency: number;
  reportGroup: number;
  typicalSource: number;
  securityRisk: number;
  useTPAName: boolean;
  applicableToTPARequest: number;
  urlNameGrouping: number;
  globalExpectedCompletionDate: string;
  binderPage: string;
  relevantToRACs: number;
  auditEvidence: number[];
  usersOfReport: number[];
  identityRisk: boolean;
  reconApplicable: boolean;
  firstYearOnly: boolean;
  safeHarborNotApplicable: boolean;
  optional: boolean;
  active: boolean;
  usefulnessToInternalAudit: string;
  usefulnessToDOLRole: string;
  relevantToSponsorMonitoring: string;
  usefulnessToCPARole: string;
  usefulnessToSponsorRole: string;
  usefulnessToTPARole: string;
}

export interface FieldsErrorType {
  reportName: boolean;
  reportFrequency: boolean;
  reportGroup: boolean;
  reportNumber: boolean;
  useTPAName: boolean;
  applicableToTPARequest: boolean;
  urlNameGrouping: boolean;
  globalExpectedCompletionDate: boolean;
  securityRisk: boolean;
  identityRisk: boolean;
  reconApplicable: boolean;
}

export interface OptionType {
  label: string;
  value: number;
}
