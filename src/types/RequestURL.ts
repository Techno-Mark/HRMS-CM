export interface LinksType {
  reportGroupMasterId: number;
  guid: string;
  reportGroup: string;
}

export interface MailComposerType {
  links: LinksType[];
  isMailComposerOpen: boolean;
  setDialogOpen: (arg1: boolean) => void;
}

export interface SecondaryDialogType {
  type: 1 | 2;
  sendMail: () => void;
  handleClose: () => void;
  isSecondaryDialogOpen: boolean;
  setPrimaryDialogOpen: (arg1: boolean) => void;
  setSecondaryDialogOpen: (arg1: boolean) => void;
}

export interface PlanDataType {
  client: number;
  finYear: number;
  planEngagementId: number;
  label: string;
  planName: string;
  sponsorName: string;
  tpaCompanyMasterId: number;
  tpaKey: string;
}
