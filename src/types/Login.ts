export interface StringFieldType {
  value: string;
  error: boolean;
  errorText: string;
}

export interface UserInfoType {
  roleName: string | null;
  id: number | null;
  userId: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  contactPhone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  roleId: number | null;
  isActive: boolean;
}

export interface ResponseDataType {
  user: UserInfoType;
  token: String;
}
