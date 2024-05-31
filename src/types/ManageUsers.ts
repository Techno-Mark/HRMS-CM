export interface UserDataType {
    roleName: string | null,
    id: number | null,
    password: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    email: string | null,
    contactPhone: string | null,
    roleId: number | null,
    isActive: boolean
}


export interface UserFormDataType {
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    contactPhone: string,
    roleId: string,
    isActive: boolean,
    id: number,
    password: string,
    isViewMode: boolean,
}