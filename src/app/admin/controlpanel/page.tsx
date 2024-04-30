"use client";
import { callAPIwithHeaders, callAPIwithParams } from "@/api/commonAPI";
import Wrapper from "@/components/Wrapper";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import { Download, MoreVert } from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState(null);
  const [moreActionsClickedRowId, setmoreActionsClickedRowId] = useState(-1);

  const getData = (userId: string) => {
    setLoaded(false);
    const callBack = async (status: boolean, message: string, data: any) => {
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

  const handleDownload = (fileName: string) => {
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        downloadFileFromBase64(data, fileName);
      } else {
        toast.error(message);
      }
    };

    callAPIwithParams(
      "/Document/DonwloadFile",
      "post",
      callBack,
      {},
      { name: "FileLink", value: fileName }
    );
  };

  const handleRecordChange = (record: any) => {
    if (record !== null) {
      getData(record.id);
      setUserName(record);
    } else {
      getData("");
      setUserName(null);
    }
  };

  const updateStatus = (statusId: number, documentUserId: number) => {
    setmoreActionsClickedRowId(-1);

    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
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
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Username
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.row.firstName + " " + params.row.lastName}</div>;
      },
    },
    {
      field: "documentName",
      headerName: "Document",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Document
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Status
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.row.status}</div>;
      },
    },
    {
      field: "documentLink",
      headerName: "Download",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Download
        </span>
      ),
      renderCell: (params) => {
        return (
          <div onClick={() => handleDownload(params.value)}>
            <Download />
          </div>
        );
      },
    },
    {
      field: "updatedOn",
      headerName: "File Name",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Date Received
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.row.updatedOn.split("T")[0]}</div>;
      },
    },
    {
      field: "uploadedDocumentName",
      headerName: "File Name",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          File Name
        </span>
      ),
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
                !(params.row.status.toLowerCase() === "accepted")
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

  return (
    <Wrapper>
      <div className="mx-5 justify-between flex flex-wrap w-full">
        {/* <div className="justify-start flex items-center font-semibold">
          Control Panel
        </div> */}
      </div>
      <div className="my-2">
        <Autocomplete
          className="w-[30%]"
          getOptionLabel={(option: any) =>
            option.firstName + " " + option.lastName
          }
          options={userData.map((data) => data)}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Username" />
          )}
          value={userName}
          onChange={(event, record: any) => {
            handleRecordChange(record);
          }}
        />
      </div>
      <div className="mx-auto flex flex-col w-full mt-4">
        <div className="tableStyle">
          <DataGrid
            disableColumnMenu
            disableRowSelectionOnClick
            sx={{
              fontSize: "12px",
              height: "70vh",
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
            getRowId={(row) => row.documentUserId}
            rows={data}
            columns={columns}
            //   slots={{
            //     footer: () => (
            //       <div className="flex justify-end">
            //         <TablePagination
            //           rowsPerPage={10}
            //           onPageChange={() => {}}
            //           onRowsPerPageChange={() => {}}
            //           count={0}
            //           page={0}
            //           rowsPerPageOptions={[5, 10, 15]}
            //         />
            //       </div>
            //     ),
            //   }}
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

  // const updateStatus = async (status: number | null) => {
  //   onClose();
  //   const callBack = (status: boolean, message: string) => {
  //     if (status) {
  //       onStatusChange();
  //       toast.success(message);
  //     } else {
  //       toast.error(message);
  //     }
  //   };

  //   callAPIwithHeaders("/ControlPanel/UpdateStatus", "post", callBack, {
  //     reportId: reportId,
  //     tpaCompanyMasterId: tpaCompanyMasterId,
  //     planEnagagementId: planEngagementId,
  //     reportGroupId: activeGroup,
  //     optional: status === 5 && optional ? false : optional,
  //     status: status,
  //     planEngageAuditMasterId: planEngageAuditMasterId,
  //     description_per_TPA: description_per_TPA ?? null,
  //     description_per_BDG: description_per_BDG,
  //   });
  // };

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

  // const getActions = () => {
  //   if (
  //     status.toLowerCase() === "pending" ||
  //     status.toLowerCase() === "resubmitted" ||
  //     status.toLowerCase() === "submitted"
  //   ) {
  //     return actions;
  //   } else {
  //     return [];
  //   }
  // };

  return (
    <div className="py-2 absolute right-16 bg-white shadow-lg z-10 rounded">
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
