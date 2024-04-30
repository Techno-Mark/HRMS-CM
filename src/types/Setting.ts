export interface ReportType {
  reportId: number;
  reportName: string;
  reportNumber: string;
}

export interface CustomGridToolbarType {
  value: string;
  handleSearchValue: () => void;
  handleSearch: (arg1?: boolean) => void;
}

export interface ReportDataType {
  reportId: number;
  reportName: string;
  reportNumber: string;
}
