"use client";
//react hooks
import { useEffect, useState } from "react";
//3rd party libraries & icons
import { toast } from "react-toastify";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Download, MoreVert } from "@mui/icons-material";
import { Autocomplete, Button, TextField } from "@mui/material";
//custom components
import Wrapper from "@/components/Wrapper";
import Loader from "@/components/common/Loader";
// common types, variables & functions
import { callAPIwithHeaders, callAPIwithParams } from "@/api/commonAPI";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import {
  DefaultData,
  UserDropDownType,
  UserTableData,
} from "@/types/ControlPanel";

const Page = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<DefaultData[] | UserTableData[]>([]);
  const [userData, setUserData] = useState<UserDropDownType[]>([]);
  const [userName, setUserName] = useState<UserDropDownType | null>(null);
  const [isDefault, setIsDefault] = useState<boolean>(true);
  const [moreActionsClickedRowId, setmoreActionsClickedRowId] =
    useState<number>(-1);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const getData = (userId: string): void => {
    setLoaded(false);
    if (userId.length === 0) {
      setIsDefault(true);
      const callBack = (status: boolean, message: string, data: any): void => {
        if (status) {
          setLoaded(true);
          setData(data);
        }
      };

      callAPIwithParams(
        "/Document/GetDocuments",
        "post",
        callBack,
        {},
        { name: "DocumentId", value: "" }
      );
    } else {
      setIsDefault(false);
      const callBack = async (
        status: boolean,
        message: string,
        data: any
      ): Promise<void> => {
        if (status) {
          setLoaded(true);
          setData(data);
        } else {
          setLoaded(true);
        }
      };

      callAPIwithParams(
        "/Document/GetUserDocuments",
        "post",
        callBack,
        {},
        { name: "UserId", value: userId }
      );
    }
  };

  const getUserData = () => {
    setLoaded(false);
    const callBack = async (status: boolean, message: string, data: any) => {
      if (status) {
        setLoaded(true);
        setUserData(data);
      } else {
        setLoaded(true);
      }
    };

    callAPIwithHeaders("/User/Users", "post", callBack, {
      UserId: null,
    });
  };

  const handleDownload = (fileLink: string, fileName: string) => {
    setLoaded(false);
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        setLoaded(true);
        downloadFileFromBase64(data, fileName);
        toast.success("File Downloaded Sucessfully");
      } else {
        setLoaded(true);
        toast.error("Please try again later!");
      }
    };

    callAPIwithParams(
      "/Document/DownloadFile",
      "post",
      callBack,
      {},
      { name: "FileLink", value: fileLink }
    );
  };

  const handleDownloadInBulk = (params: any, filename: string) => {
    setLoaded(false);
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        setLoaded(true);
        downloadFileFromBase64(data, `${filename}.zip`);
        toast.success("File Downloaded Sucessfully");
        setRowSelectionModel([]);
      } else {
        setLoaded(true);
        toast.error("Please try again later!");
      }
    };

    callAPIwithHeaders(
      "/Document/DownloadFileInBulk",
      "post",
      callBack,
      params
    );
  };

  const handleRecordChange = (record: any) => {
    if (record !== null) {
      getData(record.id);
      setUserName(record);
    } else {
      getData("");
      setUserName(null);
      setRowSelectionModel([]);
    }
  };

  const updateStatus = (statusId: number, documentUserId: number) => {
    setmoreActionsClickedRowId(-1);

    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        getData(!!userName ? String(userName.id) : "");
        toast.success(message);
      } else {
        toast.error(message);
      }
    };

    callAPIwithHeaders("/Document/ChangeDocumentStatus", "post", callBack, {
      status: statusId,
      documentUserId: documentUserId,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Username",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Username
        </span>
      ),
      renderCell: (params) => {
        return (
          <div>
            {!params.row.firstName || !params.row.lastName
              ? "-"
              : params.row.firstName + " " + params.row.lastName}
          </div>
        );
      },
    },
    {
      field: "documentName",
      headerName: "Document",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Document
        </span>
      ),
    },
    {
      field: "statusDescription",
      headerName: "Status",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Status
        </span>
      ),
      renderCell: (params) => {
        return (
          <div>
            {!params.row.statusDescription ? "-" : params.row.statusDescription}
          </div>
        );
      },
    },
    {
      field: "documentLink",
      headerName: "Download",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Download
        </span>
      ),
      renderCell: (params) => {
        return (
          <div
            className={`${
              !params.value
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
            onClick={() =>
              handleDownload(params.value, params.row.uploadedDocumentName)
            }
          >
            <Download />
          </div>
        );
      },
    },
    {
      field: "updatedOn",
      headerName: "File Name",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Date Received
        </span>
      ),
      renderCell: (params) => {
        return (
          <div>
            {!params.row.updatedOn ? "-" : params.row.updatedOn.split("T")[0]}
          </div>
        );
      },
    },
    {
      field: "uploadedDocumentName",
      headerName: "File Name",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          File Name
        </span>
      ),
      renderCell: (params) => {
        return <div>{!params.value ? "-" : params.value}</div>;
      },
    },
    {
      field: "userId",
      headerName: "Action",
      hideable: false,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Action
        </span>
      ),
      width: 80,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span
              className={`relative ${
                params.row.uploadedDocumentName &&
                !(params.row.statusDescription.toLowerCase() === "accepted")
                  ? "cursor-pointer"
                  : "pointer-events-none opacity-50"
              }`}
              onClick={
                params.row.uploadedDocumentName
                  ? () =>
                      setmoreActionsClickedRowId((prev) =>
                        prev !== params.row.documentUserId
                          ? params.row.documentUserId
                          : -1
                      )
                  : undefined
              }
            >
              <MoreVert />
            </span>
            {/* <MoreActions /> */}
            {moreActionsClickedRowId === params.row.documentUserId && (
              <MoreActions
                onAccept={() => updateStatus(5, params.row.documentUserId)}
                onReject={() => updateStatus(3, params.row.documentUserId)}
              />
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData("");
    getUserData();
  }, []);

  if (!loaded) return <Loader />;
  if (loaded)
    return (
      <Wrapper>
        <div className="mx-5 justify-between flex flex-wrap w-full"></div>
        <div className="my-2 px-3 flex justify-between">
          <Autocomplete
            className="w-[30%]"
            getOptionLabel={(option: any) =>
              option.firstName + " " + option.lastName
            }
            options={userData.map((data) => data)}
            getOptionKey={(option: any) => option.id}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Username" />
            )}
            value={userName}
            onChange={(event, record: any) => {
              handleRecordChange(record);
            }}
          />
          {rowSelectionModel.length > 1 && !!userName && (
            <Button
              variant="contained"
              onClick={() => {
                const body = data
                  .filter((d: any) =>
                    rowSelectionModel.includes(d.documentUserId)
                  )
                  .map((d: any) => d.documentName);

                handleDownloadInBulk(
                  {
                    email: userName!.email,
                    userId: userName!.id,
                    documentName: body,
                  },
                  `${userName!.firstName}_${userName!.lastName}`
                );
              }}
            >
              Download
            </Button>
          )}
        </div>
        <div className="mx-auto flex flex-col w-full mt-4">
          <div className="tableStyle">
            <DataGrid
              checkboxSelection
              isRowSelectable={(params: GridRowParams) =>
                !!params.row.uploadedDocumentName
              }
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                fontSize: "12px",
                height: "70vh",
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                ".css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone": {
                  paddingBottom: "40px",
                },
              }}
              getRowId={
                isDefault
                  ? (row) => row.documentId
                  : (row) => row.documentUserId
              }
              rows={data}
              columns={columns}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
            />
          </div>
        </div>
      </Wrapper>
    );
};

export default Page;

const MoreActions = ({ onAccept, onReject }: any) => {
  const actions = ["accept", "reject"];
  const actionStyle =
    "flex capitalize text-sm px-6 py-1 cursor-pointer hover:bg-slate-100";

  const getStatus = (action: string) => {
    switch (action.toLowerCase()) {
      case "accept":
        onAccept();
        break;
      case "reject":
        onReject();
        break;
      default:
        undefined;
        break;
    }
  };

  return (
    <div
      style={{
        boxShadow:
          "0 0 1px 0px rgba(0,0,0,0.30), 0 0 25px 4px rgba(0,0,0,0.22)",
      }}
      className="py-2 absolute right-16 bg-white shadow-lg z-10 rounded"
    >
      {actions.map((action: string) => (
        <span
          key={action}
          className={actionStyle}
          onClick={() => getStatus(action)}
        >
          {action}
        </span>
      ))}
    </div>
  );
};
