"use client";
import SearchIcon from "@/assets/icons/SearchIcon";
import Wrapper from "@/components/Wrapper";
import { Download } from "@mui/icons-material";
import {
  TextField,
  Tooltip,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { callAPIwithHeaders } from "@/api/commonAPI";
import { toast } from "react-toastify";
import Close from "@/assets/icons/Close";
import { OptionType } from "@/types/ReportDrawer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Loader from "@/components/common/Loader";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";

const CUSTOM_DATE = 5;

type TabsType = { label: string; id: 1 | 2 | 3 };

type ReportPayloadType = {
  roleId: number | null;
  startDate: string | null;
  endDate: string | null;
  period: 1 | 2 | 3 | 4 | 5 | null;
  search: string | null;
  reportType: 1 | 2 | 3;
  isDownlaod: boolean;
  UserDocumentStatus: number | null;
  PageNo: number;
  PageSize: number;
};

type FilterPopupType = {
  isFilterOpen: boolean;
  filter: ReportPayloadType;
  setFilter: React.Dispatch<React.SetStateAction<ReportPayloadType>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (arg1: ReportPayloadType) => void;
};

type HeaderComponentType = {
  totalCount: number;
  activeTab: number;
  reportPayload: ReportPayloadType;
  onExport: (arg1: ReportPayloadType) => void;
  getReportData: (arg1: ReportPayloadType) => void;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReportPayload: React.Dispatch<React.SetStateAction<ReportPayloadType>>;
};

const tabs: TabsType[] = [
  { label: "User Added", id: 1 },
  { label: "Daily Uploads", id: 3 },
  { label: "Document Status", id: 2 },
];

const RoleOptions: OptionType[] = [
  { value: 2, label: "Candidate" },
  { value: 3, label: "Employee" },
];

const PeriodOptions: OptionType[] = [
  { label: "Today", value: 1 },
  { label: "This week", value: 2 },
  { label: "This month", value: 3 },
  { label: "This year", value: 4 },
  { label: "Custom", value: 5 },
];

const DocStatusOptions: OptionType[] = [
  { label: "Pending", value: 0 },
  { label: "Submitted", value: 1 },
  { label: "Completed", value: 2 },
  { value: 3, label: "Mark As Completed" },
];

const userAddedColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Name
      </span>
    ),
  },
  {
    field: "roleName",
    headerName: "Role",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Role
      </span>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Date
      </span>
    ),
  },
];

const dailyUploadsColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Name
      </span>
    ),
  },
  {
    field: "documentName",
    headerName: "Document Name",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Document Name
      </span>
    ),
  },
  {
    field: "roleName",
    headerName: "Role",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Role
      </span>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Date
      </span>
    ),
  },
];

const documentStatusColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Name
      </span>
    ),
  },
  {
    field: "documentStatus",
    headerName: "Document Status",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Document Status
      </span>
    ),
  },
  {
    field: "roleName",
    headerName: "Role",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Role
      </span>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    sortable: false,
    flex: 1,
    renderHeader: (params) => (
      <span className="capitalize font-semibold text-sm text-[#535255]">
        Date
      </span>
    ),
  },
];

const rowsPerPageOptions = [10, 25, 50];

const Page = () => {
  const [reportData, setReportData] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(-1);
  const [reportPayload, setReportPayload] = useState<ReportPayloadType>({
    roleId: null,
    startDate: null,
    endDate: null,
    period: null,
    search: null,
    reportType: 1,
    isDownlaod: false,
    UserDocumentStatus: null,
    PageNo: 0,
    PageSize: rowsPerPageOptions[0],
  });

  const getReportData = (params: ReportPayloadType) => {
    setLoaded(false);
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        const transformedData = data.data.map((d: any, index: number) => ({
          ...d,
          index: index,
        }));
        setTotalCount(data.totalCount);
        setReportData(transformedData);
      } else {
        toast.error(message);
      }
      if (isFilterOpen) {
        setFilterOpen(false);
      }
      setLoaded(true);
    };
    callAPIwithHeaders("/Reports/GenerateReports", "post", callBack, {
      ...params,
      startDate: !!params.startDate
        ? `${params.startDate.replaceAll("/", "-")}T00:00:00.000Z`
        : null,
      endDate: !!params.endDate
        ? `${params.endDate.replaceAll("/", "-")}T00:00:00.000Z`
        : null,
    });
  };

  const handleDownload = (params: ReportPayloadType) => {
    setLoaded(false);
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        toast.success(message);
        downloadFileFromBase64(data.fileContents, data.fileDownloadName);
      } else {
        toast.error(message);
      }
      if (isFilterOpen) {
        setFilterOpen(false);
      }
      setLoaded(true);
    };
    callAPIwithHeaders("/Reports/GenerateReports", "post", callBack, {
      ...params,
      startDate: !!params.startDate
        ? `${params.startDate.replaceAll("/", "-")}T00:00:00.000Z`
        : null,
      endDate: !!params.endDate
        ? `${params.endDate.replaceAll("/", "-")}T00:00:00.000Z`
        : null,
    });
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNo: number
  ) => {
    setReportPayload((prev) => ({ ...prev, PageNo: pageNo }));
    getReportData({
      ...reportPayload,
      PageNo: pageNo,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReportPayload((prev: ReportPayloadType) => ({
      ...prev,
      PageNo: 0,
      PageSize: Number(event.target.value),
    }));
    getReportData({
      ...reportPayload,
      PageNo: 0,
      PageSize: Number(event.target.value),
    });
  };

  useEffect(() => {
    getReportData(reportPayload);
  }, []);

  if (!loaded) return <Loader />;
  if (loaded)
    return (
      <Wrapper>
        <HeaderComponent
          totalCount={totalCount}
          activeTab={activeTab}
          reportPayload={reportPayload}
          setFilterOpen={setFilterOpen}
          setActiveTab={setActiveTab}
          getReportData={getReportData}
          setReportPayload={setReportPayload}
          onExport={handleDownload}
        />
        <div className="mx-auto flex flex-col w-full mt-4">
          <div className="tableStyle">
            <DataGrid
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                fontSize: "12px",
                height: "66vh",
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                ".css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone": {
                  paddingBottom: "60px",
                },
              }}
              getRowId={(row) => row.index}
              rows={reportData}
              columns={
                reportPayload.reportType === 1
                  ? userAddedColumns
                  : reportPayload.reportType === 2
                  ? documentStatusColumns
                  : dailyUploadsColumns
              }
              slots={{
                footer: () => (
                  <div className="flex justify-end">
                    <TablePagination
                      count={totalCount}
                      page={reportPayload.PageNo}
                      onPageChange={handlePageChange}
                      rowsPerPage={reportPayload.PageSize}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      rowsPerPageOptions={rowsPerPageOptions}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </div>
        <FilterPopup
          isFilterOpen={isFilterOpen}
          filter={reportPayload}
          setFilter={setReportPayload}
          setFilterOpen={setFilterOpen}
          handleSubmit={getReportData}
        />
      </Wrapper>
    );
};

export default Page;

const HeaderComponent = ({
  totalCount,
  activeTab,
  reportPayload,
  setFilterOpen,
  setActiveTab,
  getReportData,
  setReportPayload,
  onExport,
}: HeaderComponentType) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        {tabs.map((tab: TabsType, index: number) => (
          <span
            key={tab.id}
            className={`cursor-pointer opacity-70 font-medium ${
              index === activeTab ? "opacity-100 font-semibold" : ""
            } ${index === 0 ? "pr-5" : "px-5"} ${
              index === tabs.length - 1 ? "" : "border-r-2 border-r-black"
            }`}
            onClick={() => {
              setActiveTab(index);
              setReportPayload({
                roleId: null,
                startDate: null,
                endDate: null,
                period: null,
                search: null,
                reportType: tab.id,
                isDownlaod: false,
                UserDocumentStatus: null,
                PageNo: 0,
                PageSize: rowsPerPageOptions[0],
              });
              getReportData({
                roleId: null,
                startDate: null,
                endDate: null,
                period: null,
                search: null,
                reportType: tab.id,
                isDownlaod: false,
                UserDocumentStatus: null,
                PageNo: 0,
                PageSize: rowsPerPageOptions[0],
              });
            }}
          >
            {tab.label}
          </span>
        ))}
      </div>
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="mr-5 flex items-center relative border-b border-b-black focus-within:border-b-[#223E99]">
            <TextField
              className="!w-44 pr-12"
              variant="standard"
              placeholder="Search"
              value={reportPayload.search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getReportData(reportPayload);
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setReportPayload((prev: ReportPayloadType) => ({
                  ...prev,
                  search: e.target.value,
                }));
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
            {!!reportPayload.search && reportPayload.search.length > 0 && (
              <span
                className="absolute right-7 top-2.5 cursor-pointer"
                onClick={() => {
                  setReportPayload((prev: ReportPayloadType) => ({
                    ...prev,
                    search: "",
                  }));
                  getReportData({ ...reportPayload, search: null });
                }}
              >
                <Close />
              </span>
            )}
            <span
              className={`absolute right-1.5 top-2.5 ${
                true ? "cursor-pointer" : "pointer-events-none"
              }`}
              onClick={() => getReportData(reportPayload)}
            >
              <SearchIcon />
            </span>
          </span>
        </div>

        <div className="justify-end items-end flex gap-3">
          {totalCount > -1 && (
            <>
              {reportPayload.reportType === 1 && (
                <span>Total User: {totalCount}</span>
              )}

              {reportPayload.reportType === 2 &&
                (reportPayload.UserDocumentStatus === 0 ? (
                  <span>Total Pending User Document: {totalCount}</span>
                ) : reportPayload.UserDocumentStatus === 1 ? (
                  <span>Total Submitted User Document: {totalCount}</span>
                ) : reportPayload.UserDocumentStatus === 2 ? (
                  <span>Total Completed User Document: {totalCount}</span>
                ) : reportPayload.UserDocumentStatus === 3 ? (
                  <span>Total MarkAsCompleted User Document: {totalCount}</span>
                ) : (
                  <span>Total User Document Status: {totalCount}</span>
                ))}
              {reportPayload.reportType === 3 && (
                <span>Total Document Uploads: {totalCount}</span>
              )}
            </>
          )}
          <span
            className="mt-2 cursor-pointer"
            onClick={() => setFilterOpen(true)}
          >
            <Tooltip title="Filter">
              <FilterAltIcon />
            </Tooltip>
          </span>
          <span
            className="mt-2 cursor-pointer"
            onClick={() => onExport({ ...reportPayload, isDownlaod: true })}
          >
            <Tooltip title="Export">
              <Download />
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  );
};

const FilterPopup = ({
  isFilterOpen,
  filter,
  setFilter,
  setFilterOpen,
  handleSubmit,
}: FilterPopupType) => {
  const currentDate = new Date();
  const startMinDate = new Date(currentDate);
  startMinDate.setFullYear(currentDate.getFullYear() - 2);
  const [startDateErr, setStartDateErr] = useState<boolean>(false);
  const [endDateErr, setEndDateErr] = useState<boolean>(false);
  const [appliedFilter, setAppliedFilter] = useState<ReportPayloadType>(filter);

  const handleDropDownChange = (record: any, field: string) => {
    if (record === null) {
      setAppliedFilter({ ...appliedFilter, [field]: null });
    } else {
      if (field === "period" && record.value !== CUSTOM_DATE) {
        setAppliedFilter({
          ...appliedFilter,
          [field]: record.value,
          startDate: null,
          endDate: null,
        });
      } else {
        setAppliedFilter({ ...appliedFilter, [field]: record.value });
      }
    }
  };

  const handleReset = () => {
    setFilter((prev: ReportPayloadType) => ({
      ...prev,
      roleId: null,
      startDate: null,
      endDate: null,
      period: null,
      search: null,
      isDownlaod: false,
      UserDocumentStatus: null,
      PageNo: 0,
      PageSize: rowsPerPageOptions[0],
    }));
    handleSubmit({
      ...filter,
      roleId: null,
      startDate: null,
      endDate: null,
      period: null,
      search: null,
      isDownlaod: false,
      UserDocumentStatus: null,
      PageNo: 0,
      PageSize: rowsPerPageOptions[0],
    });
    setFilterOpen(false);
  };

  const applyFilter = () => {
    if (appliedFilter.period === CUSTOM_DATE) {
      if (!appliedFilter.endDate && !appliedFilter.startDate) {
        setStartDateErr(true);
        setEndDateErr(true);
        return;
      }
      if (!appliedFilter.startDate) {
        setStartDateErr(true);
        return;
      }
      if (!appliedFilter.endDate) {
        setEndDateErr(true);
        return;
      }
      setFilter(appliedFilter);
      handleSubmit(appliedFilter);
    } else {
      setFilter(appliedFilter);
      handleSubmit(appliedFilter);
    }
  };

  return (
    <Dialog open={isFilterOpen}>
      <DialogTitle className="flex justify-between">
        <span>Filter</span>
        <Tooltip title="Close">
          <Button
            color="error"
            onClick={() => {
              setFilterOpen(false);
            }}
          >
            <Close size={1.25} />
          </Button>
        </Tooltip>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <div className="my-4 flex flex-col gap-4">
          <Autocomplete
            options={RoleOptions}
            renderInput={(params) => <TextField {...params} label="Role" />}
            value={RoleOptions.find(
              (item) => item.value === appliedFilter.roleId
            )}
            onChange={(e, record) => handleDropDownChange(record, "roleId")}
          />
          <Autocomplete
            options={PeriodOptions}
            renderInput={(params) => <TextField {...params} label="Period" />}
            value={PeriodOptions.find(
              (item) => item.value === appliedFilter.period
            )}
            onChange={(e, record) => handleDropDownChange(record, "period")}
          />
          {filter.reportType === 2 && (
            <Autocomplete
              options={DocStatusOptions}
              renderInput={(params) => (
                <TextField {...params} label="Document Status" />
              )}
              value={DocStatusOptions.find(
                (item) => item.value === appliedFilter.UserDocumentStatus
              )}
              onChange={(e, record) =>
                handleDropDownChange(record, "UserDocumentStatus")
              }
            />
          )}
          <div className="w-full flex gap-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col ">
                <DatePicker
                  label="Start Date"
                  disabled={appliedFilter.period !== CUSTOM_DATE}
                  minDate={dayjs(startMinDate)}
                  maxDate={
                    !!appliedFilter.endDate
                      ? dayjs(appliedFilter.endDate)
                      : dayjs(new Date())
                  }
                  value={
                    !!appliedFilter.startDate
                      ? dayjs(appliedFilter.startDate)
                      : null
                  }
                  onChange={(e) => {
                    const fullDate = dayjs(e).format("YYYY/MM/DD");
                    setStartDateErr(false);
                    setAppliedFilter((prev: ReportPayloadType) => ({
                      ...prev,
                      startDate: fullDate,
                    }));
                  }}
                />
                {startDateErr && (
                  <span className="mt-[3px] text-xs font-normal text-[#d32f2f]">
                    Start Date is required.
                  </span>
                )}
              </div>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col">
                <DatePicker
                  label="End Date"
                  disabled={appliedFilter.period !== CUSTOM_DATE}
                  value={
                    !!appliedFilter.endDate
                      ? dayjs(appliedFilter.endDate)
                      : null
                  }
                  minDate={
                    !!appliedFilter.startDate
                      ? dayjs(appliedFilter.startDate)
                      : dayjs(startMinDate)
                  }
                  maxDate={dayjs(new Date())}
                  onChange={(e) => {
                    const fullDate = dayjs(e).format("YYYY/MM/DD");
                    setEndDateErr(false);
                    setAppliedFilter((prev: ReportPayloadType) => ({
                      ...prev,
                      endDate: fullDate,
                    }));
                  }}
                />
                {endDateErr && (
                  <span className="mt-[3px] text-xs font-normal text-[#d32f2f]">
                    End Date is required.
                  </span>
                )}
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleReset}>
          Reset
        </Button>
        <Button type="button" onClick={applyFilter}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
