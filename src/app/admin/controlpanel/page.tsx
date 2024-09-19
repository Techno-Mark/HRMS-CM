"use client";
//react hooks
import { useEffect, useRef, useState } from "react";
//3rd party libraries & icons
import { toast } from "react-toastify";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Close, Download, MoreVert, Title } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";
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
import { Textarea } from "@mui/joy";

const ACCEPT = 5;
const REJECT = 3;

type MarkAsCompleteConfirmationDialogType = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

type StatusPayloadType = {
  status: number | null;
  documentUserId: number | null;
  userId: number | null;
  documentName: string[];
  rejectedReason: string | null;
};

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
  const [isRejectionReasonDialogOpen, setRejectionReasonDialogOpen] =
    useState<boolean>(false);
  const [allDocAccepted, setAllDocAccepted] = useState<boolean>(false);
  const [isMarkAsCompleteDialogOpen, setMarkAsCompleteDialogOpen] =
    useState<boolean>(false);

  const [rejectionBody, setRejectionBody] = useState<StatusPayloadType>({
    status: null,
    documentUserId: null,
    userId: null,
    documentName: [],
    rejectedReason: null,
  });

  const getData = (userId: string): void => {
    setLoaded(false);
    if (userId.length === 0) {
      setIsDefault(true);
      const callBack = (status: boolean, message: string, data: any): void => {
        if (status) {
          setLoaded(true);
          setData(data);
          setAllDocAccepted(false);
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

          const isAllAccepted = data.filter(
            (d: any) =>
              d.isMandatory && d.statusDescription?.toLowerCase() === "accepted"
          );

          setAllDocAccepted(data.length === isAllAccepted.length);
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
        if (!!userName) {
          setUserName(data.find((item: any) => item.id === userName.id));
        }
      } else {
        setLoaded(true);
      }
    };

    callAPIwithHeaders("/User/Users", "post", callBack, {
      UserId: null,
    });
  };

  const handleDownload = (
    fileLink: string,
    fileName: string,
    docUserId: number
  ) => {
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

    callAPIwithHeaders("/Document/DownloadFile", "post", callBack, {
      fileLink: fileLink,
      documentUserId: docUserId,
    });
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

  const updateStatus = (payload: StatusPayloadType) => {
    setRowSelectionModel([]);
    setLoaded(false);
    setmoreActionsClickedRowId(-1);

    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        if (payload.status === REJECT) {
          setRejectionReasonDialogOpen(false);
        }
        getData(!!userName ? String(userName.id) : "");
        getUserData();
        toast.success(message);
      } else {
        toast.error(message);
      }
      setLoaded(true);
    };

    callAPIwithHeaders(
      "/Document/ChangeDocumentStatus",
      "post",
      callBack,
      payload
    );
  };

  const handleMarkAsComplete = () => {
    setLoaded(false);
    const callBack = (status: boolean, message: string) => {
      setLoaded(true);
      if (status) {
        getUserData();
        toast.success(message);
        setMarkAsCompleteDialogOpen(false);
      } else {
        toast.error(message);
      }
    };
    callAPIwithHeaders("/ManageUser/MarkAsCompleted", "post", callBack, {
      userId: userName?.id,
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
          <div className="flex items-center gap-1">
            <span>
              {!params.row.statusDescription
                ? "-"
                : params.row.statusDescription}
            </span>
            {params.row.statusDescription?.toLowerCase() === "rejected" && (
              <Tooltip title={params.row.rejectionNote}>
                <InfoOutlinedIcon
                  sx={{
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                />
              </Tooltip>
            )}
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
              handleDownload(
                params.value,
                params.row.uploadedDocumentName,
                params.row.documentUserId
              )
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

            {moreActionsClickedRowId === params.row.documentUserId && (
              <MoreActions
                onAccept={() =>
                  updateStatus({
                    status: ACCEPT,
                    documentUserId: params.row.documentUserId,
                    userId: params.row.userId,
                    documentName: [params.row.documentName],
                    rejectedReason: null,
                  })
                }
                onReject={() => {
                  setRejectionReasonDialogOpen(true);
                  setRejectionBody({
                    status: REJECT,
                    documentUserId: params.row.documentUserId,
                    userId: params.row.userId,
                    documentName: [params.row.documentName],
                    rejectedReason: "",
                  });
                }}
                onOutsideClick={() => setmoreActionsClickedRowId(-1)}
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
        <div className="flex justify-between">
          <Autocomplete
            className="w-[30%]"
            noOptionsText="No active user found"
            getOptionLabel={(option: any) =>
              [
                option.firstName ?? "",
                option.middleName ?? "",
                option.lastName ?? "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            renderOption={(props, item) => (
              <li {...props} key={item.id}>
                <ListItemText>
                  {[
                    item.firstName ?? "",
                    item.middleName ?? "",
                    item.lastName ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </ListItemText>
              </li>
            )}
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
          <div className="flex gap-3">
            {rowSelectionModel.length > 1 && !!userName && (
              <Button
                variant="contained"
                onClick={() => {
                  const documentNames = data
                    .filter((d: any) =>
                      rowSelectionModel.includes(d.documentUserId)
                    )
                    .map((d: any) => d.documentName);

                  const documentMasterIds = data
                    .filter((d: any) =>
                      rowSelectionModel.includes(d.documentUserId)
                    )
                    .map((d: any) => d.documentMasterId);

                  handleDownloadInBulk(
                    {
                      email: userName!.email,
                      userId: userName!.id,
                      documentName: documentNames,
                      documentMasterId: documentMasterIds,
                    },
                    [
                      userName?.firstName ?? "",
                      userName?.middleName ?? "",
                      userName?.lastName ?? "",
                    ]
                      .filter(Boolean)
                      .join("_")
                  );
                }}
              >
                Download
              </Button>
            )}
            {allDocAccepted &&
              userName?.userDocStatus !== "MarkAsCompleted" && (
                <Button
                  variant="contained"
                  onClick={() => setMarkAsCompleteDialogOpen(true)}
                >
                  Mark as complete
                </Button>
              )}
          </div>
        </div>
        <div className="mx-auto flex flex-col w-full mt-4">
          <div className="tableStyle">
            <DataGrid
              checkboxSelection
              isRowSelectable={(params: GridRowParams) =>
                !!params.row.uploadedDocumentName &&
                userName?.userDocStatus !== "MarkAsCompleted"
              }
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                fontSize: "12px",
                height: "72vh",
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

        <RejectionReasonDialog
          open={isRejectionReasonDialogOpen}
          onClose={setRejectionReasonDialogOpen}
          onSubmit={(reason: string) => {
            updateStatus({ ...rejectionBody, rejectedReason: reason });
          }}
        />

        <MarkAsCompleteConfirmationDialog
          open={isMarkAsCompleteDialogOpen}
          onSubmit={handleMarkAsComplete}
          onClose={() => setMarkAsCompleteDialogOpen(false)}
        />
      </Wrapper>
    );
};

export default Page;

const MoreActions = ({ onAccept, onReject, onOutsideClick }: any) => {
  const divRef = useRef<any>(null);
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

  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (!divRef.current?.contains(event.target)) {
        onOutsideClick();
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [divRef]);

  return (
    <div
      ref={divRef}
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

const RejectionReasonDialog = ({ open, onClose, onSubmit }: any) => {
  const [reason, setReason] = useState<string>("");
  const [hasErr, setHasErr] = useState<boolean>(false);

  return (
    <Dialog open={open} fullWidth onClose={() => onClose(false)}>
      <DialogTitle className="flex justify-between items-center">
        <div>Reason for rejecting the file</div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setReason("");
            setHasErr(false);
            onClose(false);
          }}
        >
          <Tooltip title="Close">
            <Close />
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <Textarea
          color={hasErr ? "danger" : "neutral"}
          minRows={4}
          maxRows={4}
          placeholder="provide reason..."
          value={reason}
          onChange={(e) => {
            if (reason.length > 300) {
              return;
            } else {
              setHasErr(false);
              setReason(e.target.value);
            }
          }}
        />
        {hasErr && (
          <p className="mt-1 text-sm text-red-600">Please provide the reason</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          onClick={() => {
            if (reason.length === 0) {
              setHasErr(true);
              return;
            } else {
              onSubmit(reason);
            }
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MarkAsCompleteConfirmationDialog = ({
  open,
  onClose,
  onSubmit,
}: MarkAsCompleteConfirmationDialogType) => {
  return (
    <Dialog open={open} maxWidth="xs" onClose={onClose}>
      <DialogTitle className="flex justify-between items-center">
        <div>Confirm</div>
      </DialogTitle>
      <DialogContent>
        Once the user is marked as completed, access to their documents will be
        restricted. Are you sure you want to do that?
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          No
        </Button>
        <Button type="button" color="error" onClick={onSubmit}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
