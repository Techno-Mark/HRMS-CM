export interface OptionType {
  label: string;
  value: string;
}

export interface ReportListType {
  providerSource: string;
  description_per_TPA: string;
  auditDocumentId: number;
  reportNumber: number;
  reportName: string;
  reportGroupId: number;
  reportId: number;
  reportCode: number;
  reportGroup: string;
  version: number;
  useTPANameWhenRequesting: boolean;
  tpaCompanyMasterId: number;
  level: string;
}

export interface DefaultAuditReportListType {
  useTPANameWhenRequesting: boolean;
  effectiveDate: string;
  enteredBy: string;
  enteredDate: string;
  reviewedBy: string;
  reviewedDate: string;
  reportList: ReportListType[];
  version: number;
}

export interface ReportListType {
  reportId: number;
  reportName: string;
  reportNumber: number;
}

export interface DefaultAuditReportsType {
  tpaReportList: ReportListType[];
  defaultReportList: ReportListType[];
}

export interface FieldsType {
  tpaServiceProvider: string | number | null;
  level: string | number | null;
  version: number | null;
  override: boolean;
  updatedBy: string;
  updatedDate: string;
  reviewedBy: string;
  reviewedDate: string;
  effectiveDate: string;
  currentEffectiveDate: string;
}

export interface AuditReportListType {
  providerSource: string | null;
  description_per_TPA: string | null;
  reportNumber: number;
  reportName: string;
  reportGroupId: number;
  reportId: number;
  reportCode: number;
  reportGroup: string;
  version: number;
  tpaCompanyMasterId: string | null | number;
  level: string | number | null;
}

export interface UpdatedColumnsType {
  reportList: AuditReportListType[];
  enteredBy: string;
  enteredDate: string;
  reviewedBy: string;
  reviewedDate: string;
  useTPANameWhenRequesting: boolean;
  effectiveDate: string;
  version: number;
}
