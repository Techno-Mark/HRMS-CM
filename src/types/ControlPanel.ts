export interface PlanType {
  client: number;
  sponsorName: string;
  label: string;
  planName: string;
  tpaKey: string;
  finYear: number;
  planEngagementId: number;
  tpaCompanyMasterId: number;
}

export interface GroupType {
  id: number;
  reportGroupTypes: string;
  active: boolean;
  activeId: number;
}

export interface CustomGridToolbarPropsType {
  activeGroup: number;
  activeGroupID: number;
  groupTypes: GroupType[];
  onGroupTypeChange: (arg1: number) => void;
  setButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  tpaCompanyMasterId: number;
  planEnagagementId: number;
}

export interface MoreActionsPropsType {
  status: string;
  reportId: number;
  optional: boolean;
  onClose: () => void;
  fileLink: string | null;
  onStatusChange: () => void;
  planEngagementId: number | null;
  tpaCompanyMasterId: number | null;
  activeGroup: number;
  planEngageAuditMasterId: number;
  description_per_TPA: string;
  description_per_BDG: string;
}

export interface Report {
  reportNumber: string | number;
}

export interface ReportListForLinksType {
  tableId: number;
  reportName: string;
  reportUrl: string;
}

export interface PlanProps {
  planEngagementId: number;
  planName: string;
  label: string;
  sponsorName: string;
  client: number;
  tpaKey: string;
  tpaCompanyMasterId: number;
  finYear: number;
}

export interface GroupProp {
  id: number;
  reportGroupTypes: string;
}

export interface AdminProps {
  reportGroupId: number | null;
  reportGroup: string | null;
  documentStatus: string | null;
  documentSortOrder: number | null;
  reportName: string;
  reportId: number;
  reportNumber: number;
  notApplicable: boolean | null;
  providerSource: string | null;
  description_per_TPA: string | null;
  planEngageMasterId: number | null;
  planEngageAuditMasterId: number | null;
  fileLink: string | null;
  tpaLevel: string | null;
  tpaApplicable: boolean | null;
  dateReceived: string | null;
  fileName: string | null;
  fileType: string | null;
  description_per_BDG: string | null;
  auditEvidance: string | null;
  dateExpected: string | null;
  year: number | null;
  tpaCompanyMasterId: number | null;
  optional: boolean;
}
