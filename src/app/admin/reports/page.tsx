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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { callAPIwithHeaders } from "@/api/commonAPI";
import { toast } from "react-toastify";
import Close from "@/assets/icons/Close";
import { OptionType } from "@/types/ReportDrawer";
import { initialFieldsError_State } from "@/static/setting/FormVariables";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Loader from "@/components/common/Loader";

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
};

type FilterPopupType = {
  isFilterOpen: boolean;
  filter: ReportPayloadType;
  setFilter: React.Dispatch<React.SetStateAction<ReportPayloadType>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (arg1: ReportPayloadType) => void;
};

type HeaderComponentType = {
  activeTab: number;
  reportPayload: ReportPayloadType;
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

const Page = () => {
  const [reportData, setReportData] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [reportPayload, setReportPayload] = useState<ReportPayloadType>({
    roleId: null,
    startDate: null,
    endDate: null,
    period: null,
    search: null,
    reportType: 1,
    isDownlaod: false,
  });

  const getReportData = (params: ReportPayloadType) => {
    setLoaded(false);
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        const transformedData = data.map((d: any, index: number) => ({
          ...d,
          index: index,
        }));
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

  useEffect(() => {
    getReportData(reportPayload);
  }, []);

  useEffect(() => {
    // setFilteredColumns(col)
  }, [reportPayload.reportType]);

  if (!loaded) return <Loader />;
  if (loaded)
    return (
      <Wrapper>
        <HeaderComponent
          activeTab={activeTab}
          reportPayload={reportPayload}
          setFilterOpen={setFilterOpen}
          setActiveTab={setActiveTab}
          getReportData={getReportData}
          setReportPayload={setReportPayload}
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
  activeTab,
  reportPayload,
  setFilterOpen,
  setActiveTab,
  getReportData,
  setReportPayload,
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
              setReportPayload((prev: ReportPayloadType) => ({
                ...prev,
                reportType: tab.id,
              }));
              getReportData({ ...reportPayload, reportType: tab.id });
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

        <div className="justify-end flex flex-wrap gap-3 w-full">
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
            onClick={() =>
              getReportData({ ...reportPayload, isDownlaod: true })
            }
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

  const handleDropDownChange = (record: any, field: string) => {
    if (record === null) {
      setFilter({ ...filter, [field]: null });
    } else {
      if (field === "period" && record.value !== CUSTOM_DATE) {
        setFilter({
          ...filter,
          [field]: record.value,
          startDate: null,
          endDate: null,
        });
      } else {
        setFilter({ ...filter, [field]: record.value });
      }
    }
  };

  const handleReset = () => {
    setFilter({
      roleId: null,
      startDate: null,
      endDate: null,
      period: null,
      search: null,
      reportType: 1,
      isDownlaod: false,
    });
    handleSubmit({
      roleId: null,
      startDate: null,
      endDate: null,
      period: null,
      search: null,
      reportType: 1,
      isDownlaod: false,
    });
    setFilterOpen(false);
  };

  const applyFilter = () => {
    if (filter.period === CUSTOM_DATE) {
      if (!filter.endDate && !filter.startDate) {
        setStartDateErr(true);
        setEndDateErr(true);
        return;
      }
      if (!filter.startDate) {
        setStartDateErr(true);
        return;
      }
      if (!filter.endDate) {
        setEndDateErr(true);
        return;
      }
      handleSubmit(filter);
    } else {
      handleSubmit(filter);
    }
  };

  return (
    <Dialog open={isFilterOpen}>
      <DialogTitle className="flex justify-between">
        <span>Filter</span>
        <Tooltip title="Close">
          <Button color="error" onClick={() => setFilterOpen(false)}>
            <Close size={1.25} />
          </Button>
        </Tooltip>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <div className="my-4 flex flex-col gap-4">
          <Autocomplete
            options={RoleOptions}
            renderInput={(params) => <TextField {...params} label="Role" />}
            value={RoleOptions.find((item) => item.value === filter.roleId)}
            onChange={(e, record) => handleDropDownChange(record, "roleId")}
          />
          <Autocomplete
            options={PeriodOptions}
            renderInput={(params) => <TextField {...params} label="Period" />}
            value={PeriodOptions.find((item) => item.value === filter.period)}
            onChange={(e, record) => handleDropDownChange(record, "period")}
          />
          <div className="w-full flex gap-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col ">
                <DatePicker
                  label="Start Date"
                  disabled={filter.period !== CUSTOM_DATE}
                  minDate={dayjs(startMinDate)}
                  maxDate={
                    !!filter.endDate ? dayjs(filter.endDate) : dayjs(new Date())
                  }
                  value={!!filter.startDate ? dayjs(filter.startDate) : null}
                  onChange={(e) => {
                    const fullDate = dayjs(e).format("YYYY/MM/DD");
                    setStartDateErr(false);
                    setFilter((prev: ReportPayloadType) => ({
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
                  disabled={filter.period !== CUSTOM_DATE}
                  value={!!filter.endDate ? dayjs(filter.endDate) : null}
                  minDate={
                    !!filter.startDate
                      ? dayjs(filter.startDate)
                      : dayjs(startMinDate)
                  }
                  maxDate={dayjs(new Date())}
                  onChange={(e) => {
                    const fullDate = dayjs(e).format("YYYY/MM/DD");
                    setEndDateErr(false);
                    setFilter((prev: ReportPayloadType) => ({
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
