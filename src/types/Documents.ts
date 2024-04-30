import { Dispatch, SetStateAction } from "react";

export interface CustomGridToolbarProps {
  value: string;
  handleSearch: (isClearing?: boolean) => void;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export interface InitialBodyProps {
  id: null | number;
  folderName: null | string | number;
  type: number;
  Search: null | string;
  PageNo: number | string;
  PageSize: number | string;
}

export interface BreadCrumbListProps {
  id: null | number;
  label: null | string;
}

export interface DocumentProps {
  id: number;
  name: string;
  type: number;
  createdOn: string;
  updatedOn: string;
  url: string | null;
  count: string;
  size: string | null;
}
