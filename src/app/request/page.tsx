"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Alert,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toastOptions } from "@/static/toastOptions";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Header from "@/components/Header";
import { validateFile } from "@/utils/validateFile";
import {
  callAPIwithHeadersForRequest,
  callAPIwithParams,
  callAPIwithoutHeaders,
} from "@/api/commonAPI";

export default function Home() {
  const getToken = useSearchParams();
  const tokenData = getToken.get("id");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [reportDetails, setReportDetails] = useState<any>([]);
  const [fileNameMap, setFileNameMap] = useState<any>({});
  const [expectedDateMap, setExpectedDateMap] = useState<any>({});
  const [statusMap, setStatusMap] = useState<any>({});
  const [isNAMap, setIsNAMap] = useState<any>({});
  const [fileTypeErrMap, setFileTypeErrMap] = useState<any>({});
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState(0);
  const [highlightedRows, setHighlightedRows] = useState<any>([]);
  const [tokenGuid, setTokenGuid] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    verifyToken(tokenData);
    // if (sessionStorage.getItem("userInfo")) {
    //   setValidated(true);
    //   getDocumentsList(JSON.parse(sessionStorage.getItem("userInfo")!).id);
    // } else {
    //   setValidated(false);
    // }
  }, []);

  useEffect(() => {
    if (isUploading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 20);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isUploading]);

  const verifyToken = (accessPIN: any) => {
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        setLoaded(true);
        setValidated(true);
        getDocumentsList(data[0].id);
        sessionStorage.setItem("userInfo", JSON.stringify(data[0]));
      } else {
        setLoaded(true);
        setValidated(false);
      }
    };

    callAPIwithoutHeaders("/ManageUser/ValidateDocUrl", "post", callBack, {
      link: accessPIN,
    });
  };

  const handleFileUpload = async (id: number, value: File) => {
    const validateExtensions = 1;
    const validateSize = 2;
    const reportData = reportDetails.filter(
      (row: any) => row.documentUserId === id
    );

    if (!validateFile(value, validateExtensions)) {
      setFileTypeErrMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: true,
        })
      );
      setFileNameMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: null,
        })
      );
      setIsUploading(false);
    } else if (validateFile(value, validateSize)) {
      setFileTypeErrMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: -1,
        })
      );
      setFileNameMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: null,
        })
      );
      setIsUploading(false);
    } else {
      setFileTypeErrMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: false,
        })
      );
      setIsNAMap((previsNAMap: Record<number, string> | null | undefined) => ({
        ...previsNAMap,
        [id]: false,
      }));
      setFileNameMap(
        (prevFileNameMap: Record<number, string> | null | undefined) => ({
          ...prevFileNameMap,
          [id]: value.name,
        })
      );
      setIsUploading(true);

      setExpectedDateMap(
        (prevExpectedDateMap: Record<number, string> | null | undefined) => ({
          ...prevExpectedDateMap,
          [id]: "",
        })
      );

      const formData: FormData = new FormData();
      formData.append("file", value);
      formData.append("DocumentUserId", reportData[0].documentUserId);
      formData.append("UserId", String(reportData[0].userId));
      formData.append("Email", String(reportData[0].email));

      const callBack = (status: boolean, message: string, data: string) => {
        if (status) {
          // const updateReportDetails = reportDetails.map((report: any) =>
          //   report.id === id ? { ...report, documentStatus: data } : report
          // );

          // setReportDetails(updateReportDetails);
          verifyToken(tokenData);
          setStatusMap(
            (prevStatusMap: Record<number, string> | null | undefined) => ({
              ...prevStatusMap,
              [id]: "Submitted",
            })
          );
          setTimeout(() => {
            setFileNameMap(
              (prevFileNameMap: Record<number, string> | null | undefined) => ({
                ...prevFileNameMap,
                [id]: null,
              })
            );
          }, 3000);
          setIsUploading(false);
          setProgress(0);
        } else {
          setIsUploading(false);
          setFileNameMap(
            (prevFileNameMap: Record<number, string> | null | undefined) => ({
              ...prevFileNameMap,
              [id]: null,
            })
          );
          toast.error(message, toastOptions);
        }
      };

      callAPIwithHeadersForRequest(
        "/Document/UploadDocument",
        "post",
        callBack,
        formData,
        {
          Authorization: `Bearer ${tokenGuid}`,
        }
      );
    }
  };

  const getDocumentsList = (id: string) => {
    const callBack = async (status: boolean, message: string, data: any) => {
      if (status) {
        console.log(data);

        setReportDetails(data);
      } else {
      }
    };

    callAPIwithParams(
      "/Document/GetUserDocuments",
      "post",
      callBack,
      {},
      { name: "UserId", value: id }
    );
  };

  const columns: GridColDef[] = [
    {
      field: "documentName",
      sortable: false,
      filterable: false,
      renderHeader: (params) => (
        <span className="capitalize font-bold text-xs text-[#535255]">
          Document Name
        </span>
      ),
      flex: 1,
      renderCell: (params) => {
        return (
          <span className="text-xs font-normal text-[#333]">
            {params.value}
          </span>
        );
      },
    },
    {
      field: "file_upload",
      sortable: false,
      renderHeader: () => (
        <span className="capitalize font-bold text-xs text-[#535255]">
          Uploaded Files
        </span>
      ),
      flex: 1,
      renderCell: (params) => {
        const { documentUserId: id } = params.row;
        const fileName1 = fileNameMap[id] || "";
        const fileTypeErr1 = fileTypeErrMap[id] || "";
        const status = statusMap[id] || "Pending";
        return (
          <>
            <div className="h-full w-full flex flex-wrap justify-center text-center">
              <div
                className={`${
                  fileTypeErr1 ? "h-8" : "!h-10"
                } border-2 border-dotted bg-gray-100 ${
                  (alert === 2 && highlightedRows.includes(id)) || fileTypeErr1
                    ? `border-red-600`
                    : `border-gray-300`
                } rounded-full w-full overflow-hidden flex justify-center items-center`}
              >
                <span>
                  {fileName1 !== "" ? (
                    <span className="text-center justify-center items-center w-full flex text-xs font-normal text-[#333] p-2">
                      {isUploading && status === "Pending" ? (
                        <div className="w-5/6">
                          <span>Uploading..</span>
                          <LinearProgress
                            className="!w-40"
                            variant="determinate"
                            value={progress}
                          />
                        </div>
                      ) : (
                        <span className="truncate">{fileName1}</span>
                      )}
                    </span>
                  ) : (
                    <Dropzone
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(id, acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="p-1">
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <span
                              className={`select-none justify-center items-center text-center text-xs font-normal text-[#333] p-2`}
                            >
                              <AttachmentIcon className="mr-[4px] text-[15px] text-[#808080]" />
                              Drag and drop or&nbsp;
                              <span className="text-[#223E99] underline">
                                browse
                              </span>
                              &nbsp;to attach
                            </span>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  )}
                </span>
              </div>
              <div className="-mt-5">
                {fileTypeErr1 === true ? (
                  <span className="text-red-600 text-[8px]">
                    File type must be txt, pdf, xlsx,xls, csv, doc, docx, rpt
                    and prn
                  </span>
                ) : fileTypeErr1 === -1 ? (
                  <span className="text-red-600 text-[8px]">
                    File size shouldn&apos;t be more than 100MB
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        );
      },
    },
    {
      field: "updatedOn",
      sortable: false,
      renderHeader: () => (
        <span className="capitalize font-bold text-xs text-[#535255]">
          Upload Date
        </span>
      ),
      width: 150,
      renderCell: (params) => {
        return (
          <span className="text-xs font-normal text-[#333]">
            {params.value.split("T")[0]}
          </span>
        );
      },
    },
    {
      field: "status",
      sortable: false,
      renderHeader: (params) => (
        <span className="capitalize font-bold text-xs text-[#535255]">
          Status
        </span>
      ),
      width: 130,
      renderCell: (params) => {
        return (
          <div className="h-full flex items-center flex-row">
            <span className="text-xs font-normal text-[#333]">
              {params.value}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-h-screen flex flex-col">
      <div className="top-0">
        <Header />
      </div>

      {alert === 1 && (
        <Alert
          severity="success"
          className="ml-4 mt-2 mr-4"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(0);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Form Submitted Successfully!!
        </Alert>
      )}
      {alert === 2 && (
        <Alert
          severity="error"
          className="ml-4 mt-2 mr-4"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(0);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Please upload the file or provide expected date against the report in
          the form.
        </Alert>
      )}

      {loaded ? (
        <>
          <div className={`mx-auto my-4 flex flex-col px-4 w-full mb-4`}>
            <div
              style={{
                height: `calc(100vh - 127px - 40px)`,
              }}
            >
              <DataGrid
                disableColumnMenu
                rows={reportDetails}
                getRowId={(row) => row.documentUserId}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnSelector
                hideFooter
              />
            </div>
          </div>
        </>
      ) : (
        <span className="flex justify-center items-center h-screen">
          <CircularProgress size={40} className="text-[#223E99]" />
        </span>
      )}
    </div>
  );
}
