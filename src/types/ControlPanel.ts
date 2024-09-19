export interface DefaultData {
  documentId: number;
  documentName: string;
  isActive: boolean;
  isMandatory: boolean;
}

export interface UserTableData {
  userId: number;
  documentName: string;
  statusDescription: string;
  updatedOn: string;
  uploadedDocumentName: string;
  documentLink: string;
  documentUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  documentMasterId: number;
}

export interface UserDropDownType {
  roleName: string;
  id: number;
  password: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  roleId: number;
  isActive: boolean;
  userDocStatus: string;
}
