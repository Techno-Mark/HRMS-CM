export interface transformedDataProps {
  reportGroupId: number;
  reportGroup: string;
  reportName: string;
  reportId: number;
  reportNumber: number;
  documentStatus: string;
  documentSortOrder: number;
  providerSource: string;
  tpaCompanyMasterId: number;
  planEngageMasterId: number;
  notApplicable: boolean | null;
  dateReceived: string | null;
  fileName: string | null;
  fileType: string | null;
  useTPADescriptions: boolean;
  description_per_BDG: string;
  description_per_TPA: string;
  dateExpected: string | null;
  year: number;
  optional: boolean;
  client: number;
  id?: number;
  tableId?: number;
}

export interface VerifyTokenDataType {
  accessToken: string;
}

export interface UserDataType {
  contactName: string;
  email: string;
  firstName: string;
  planName: string;
}
