"use client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Alert,
  Button,
  Switch,
  IconButton,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toastOptions } from "@/static/toastOptions";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DescriptionText from "@/components/request/DescriptionText";
import { validateFile } from "@/utils/validateFile";
import {
  callAPIwithHeadersForRequest,
  callAPIwithParams,
  callAPIwithoutHeaders,
} from "@/api/commonAPI";
import { transformedDataProps, UserDataType } from "@/types/Request";
import ValidateModel from "@/components/request/ValidateModel";

export default function Home() {
  const router = useRouter();
  const getToken = useSearchParams();
  const tokenData = getToken.get("id");
  const [loaded, setLoaded] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [reportDetails, setReportDetails] = useState<any>([]);
  const [planSponserName, setPlanSponserName] = useState("");
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
  const [payload, setPayload] = useState({
    email: "",
    pin: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      setValidated(true);
      getDocumentsList(JSON.parse(sessionStorage.getItem("userInfo")!).id);
    } else {
      setValidated(false);
    }
  }, []);

  const GetPlanName = async () => {
    const callBack = async (
      status: boolean,
      message: string,
      data: {
        planName: string;
        planEngageMasterId: string;
      }[]
    ) => {
      if (status) {
        setPlanSponserName(data[0].planName);
      } else {
        toast.error(message);
      }
    };

    callAPIwithParams(
      "/Plan/GetPlanNamesOnly",
      "get",
      callBack,
      {},
      { name: "Token", value: tokenData!.toString() }
    );
  };

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

  // const getReportDetails = async (guid: string) => {
  //   const callBack = (
  //     status: boolean,
  //     message: string,
  //     {
  //       reports,
  //       descriptions,
  //     }: { reports: transformedDataProps[]; descriptions: UserDataType }
  //   ) => {
  //     if (status) {
  //       setEmail(descriptions.email);
  //       setName(descriptions.contactName);
  //       setPlanSponserName(descriptions.planName);
  //       const transformedData = reports.map(
  //         (item: transformedDataProps, index: number) => {
  //           const reportId = item.reportId;
  //           const id = reportId;
  //           return { ...item, id, tableId: index };
  //         }
  //       );
  //       if (transformedData.length > 0) {
  //         setLoaded(true);
  //         setReportDetails(transformedData);
  //         const dateExpectedResult = transformedData.filter(
  //           (row: transformedDataProps) =>
  //             row.dateExpected === null &&
  //             row.dateReceived === null &&
  //             row.optional !== true
  //         );
  //         setHighlightedRows(
  //           dateExpectedResult.map((row: transformedDataProps) => row.reportId)
  //         );
  //       } else {
  //         setLoaded(true);
  //       }
  //     } else {
  //       setLoaded(true);
  //       toast.error(message, toastOptions);
  //     }
  //   };

  //   callAPIwithHeadersForRequest(
  //     "/Report/GetReportDetails",
  //     "get",
  //     callBack,
  //     {},
  //     {
  //       Authorization: `Bearer ${guid}`,
  //     }
  //   );
  // };

  //   const verifyToken = async (domainName: string, pin: string) => {
  //     const callBack = (
  //       status: boolean,
  //       message: string,
  //       data: VerifyTokenDataType
  //     ) => {
  //       if (status) {
  //         setLoaded(true);
  //         setValidated(true);
  //         setTokenGuid(data.accessToken);
  //         getReportDetails(data.accessToken);
  //         sessionStorage.setItem("token_request", data.accessToken);
  //       } else {
  //         setLoaded(true);
  //         toast.error(message, toastOptions);
  //       }
  //     };
  //     setPayload({ email: domainName, pin: pin });
  //     callAPIwithoutHeaders("/Utility/VerifyToken", "post", callBack, {
  //       token: tokenData!,
  //       domainName: domainName,
  //       pin: pin,
  //     });
  //   };

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

  const toggleSwitch = async (id: number, value: boolean) => {
    const formData = new FormData();
    const updateReportDetails = reportDetails.map((report: any) =>
      report.id === id ? { ...report, notApplicable: value } : report
    );

    setReportDetails(updateReportDetails);

    const reportData = reportDetails.filter(
      (row: transformedDataProps) => row.id === id
    );
    const expectedDate =
      reportData[0].dateExpected == null || reportData[0].dateExpected == ""
        ? ""
        : reportData[0].dateExpected;

    setIsNAMap((previsNAMap: Record<number, boolean> | null | undefined) => ({
      ...previsNAMap,
      [id]: value,
    }));
    setStatusMap(
      (prevStatusMap: Record<number, string> | null | undefined) => ({
        ...prevStatusMap,
        [id]: value ? "NA" : "pending",
      })
    );
    setExpectedDateMap(
      (prevExpectedDateMap: Record<number, string> | null | undefined) => ({
        ...prevExpectedDateMap,
        [id]: null,
      })
    );
    setFileNameMap(
      (prevFileNameMap: Record<number, string> | null | undefined) => ({
        ...prevFileNameMap,
        [id]: null,
      })
    );

    formData.append("placedBy", "LWG");
    formData.append("notApplicable", String(value));
    formData.append("Client", String(reportData[0].client));
    formData.append("DateExpected", expectedDate);
    formData.append("reportYear", String(reportData[0].year));
    formData.append("optional", reportData[0].optional);
    formData.append("reportId", reportData[0].reportId);
    formData.append("reportNumber", reportData[0].reportNumber);
    formData.append(
      "PlanEngageMasterId",
      String(reportData[0].planEngageMasterId)
    );
    formData.append("description", reportData[0].description_per_TPA);
    formData.append(
      "tpaCompanyMasterId",
      String(reportData[0].tpaCompanyMasterId)
    );
    formData.append("Description_per_BDG", reportData[0].description_per_BDG);

    const callBack = (status: boolean, message: string, data: string) => {
      if (status) {
        const updateReportDetails = reportDetails.map((report: any) =>
          report.id === id
            ? { ...report, notApplicable: value, documentStatus: data }
            : report
        );

        setReportDetails(updateReportDetails);
        setFileNameMap(
          (prevFileNameMap: Record<number, string> | null | undefined) => ({
            ...prevFileNameMap,
            [id]: null,
          })
        );
      } else {
        toast.error(message, toastOptions);
      }
    };

    callAPIwithHeadersForRequest(
      "/Plan/AddPlanEngagementAuditDocuments",
      "post",
      callBack,
      formData,
      {
        Authorization: `Bearer ${tokenGuid}`,
      }
    );
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
      // formData.append("PlacedBy", "LWG");
      // formData.append("optional", "false");
      // formData.append("Description_per_BDG", reportData[0].description_per_BDG);
      // formData.append("Client", String(reportData[0].client));
      // formData.append("ReportYear", String(reportData[0].year));
      // formData.append(
      //   "PlanEngageMasterId",
      //   String(reportData[0].planEngageMasterId)
      // );
      // formData.append(
      //   "tpaCompanyMasterId",
      //   String(reportData[0].tpaCompanyMasterId)
      // );

      const callBack = (status: boolean, message: string, data: string) => {
        if (status) {
          const updateReportDetails = reportDetails.map((report: any) =>
            report.id === id ? { ...report, documentStatus: data } : report
          );

          setReportDetails(updateReportDetails);

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

  // const handleExceptedDate = async (id: number, value: dayjs.Dayjs | null) => {
  //   const formattedDate = dayjs(value).format("MM/DD/YYYY");
  //   setExpectedDateMap(
  //     (prevExpectedDateMap: Record<number, string> | null | undefined) => ({
  //       ...prevExpectedDateMap,
  //       [id]: value,
  //     })
  //   );
  //   setFileNameMap(
  //     (prevFileNameMap: Record<number, string> | null | undefined) => ({
  //       ...prevFileNameMap,
  //       [id]: null,
  //     })
  //   );

  //   setIsNAMap((previsNAMap: Record<number, string> | null | undefined) => ({
  //     ...previsNAMap,
  //     [id]: false,
  //   }));

  //   const reportData: transformedDataProps[] | [] = reportDetails.filter(
  //     (row: transformedDataProps) => row.reportId === id
  //   );

  //   const formData: FormData = new FormData();
  //   formData.append("Description", reportData[0].description_per_TPA);
  //   formData.append("DateExpected", formattedDate);
  //   formData.append("ReportId", String(reportData[0].reportId));
  //   formData.append("reportNumber", String(reportData[0].reportNumber));
  //   formData.append("PlacedBy", "LWG");
  //   formData.append("optional", String(reportData[0].optional));
  //   formData.append("notApplicable", String(reportData[0].notApplicable));
  //   formData.append("Description_per_BDG", reportData[0].description_per_BDG);
  //   formData.append("Client", String(reportData[0].client));
  //   formData.append("ReportYear", String(reportData[0].year));
  //   formData.append(
  //     "PlanEngageMasterId",
  //     String(reportData[0].planEngageMasterId)
  //   );
  //   formData.append(
  //     "tpaCompanyMasterId",
  //     String(reportData[0].tpaCompanyMasterId)
  //   );

  //   const callBack = (status: boolean, message: string, data: string) => {
  //     if (status) {
  //       setStatusMap(
  //         (prevStatusMap: Record<number, string> | null | undefined) => ({
  //           ...prevStatusMap,
  //           [id]: "Pending",
  //         })
  //       );
  //       setFileNameMap(
  //         (prevFileNameMap: Record<number, string> | null | undefined) => ({
  //           ...prevFileNameMap,
  //           [id]: null,
  //         })
  //       );

  //       const updateReportDetails = reportDetails.map((report: any) =>
  //         report.id === id ? { ...report, documentStatus: data } : report
  //       );

  //       setReportDetails(updateReportDetails);
  //     } else {
  //       toast.error(message, toastOptions);
  //     }
  //   };

  //   callAPIwithHeadersForRequest(
  //     "/Plan/AddPlanEngagementAuditDocuments",
  //     "post",
  //     callBack,
  //     formData,
  //     {
  //       Authorization: `Bearer ${tokenGuid}`,
  //     }
  //   );
  // };

  // const handleSubmit = async () => {
  //   const dateExpectedResult = reportDetails.filter(
  //     (row: transformedDataProps) =>
  //       row.dateExpected === null &&
  //       row.dateReceived === null &&
  //       row.notApplicable !== true
  //   );

  //   if (dateExpectedResult.length > 0) {
  //     setAlert(2);
  //     setHighlightedRows(
  //       dateExpectedResult.map((row: transformedDataProps) => row.reportId)
  //     );
  //   } else {
  //     setAlert(1);
  //     setHighlightedRows([]);

  //     const callBack = (status: boolean, message: string) => {
  //       if (status) {
  //         getReportDetails(tokenGuid);
  //         setAlert(1);
  //       } else {
  //         setAlert(2);
  //         toast.error(message, toastOptions);
  //       }
  //     };

  //     callAPIwithHeadersForRequest(
  //       "/Report/SubmitReports",
  //       "post",
  //       callBack,
  //       {},
  //       {
  //         Authorization: `Bearer ${tokenGuid}`,
  //       }
  //     );
  //   }
  // };

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
            <div className="h-full flex-col w-full flex justify-center text-center">
              <div
                className={`h-10 border-2 border-dotted bg-gray-100 ${
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
              <span>
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
              </span>
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
    // {
    //   field: "",
    //   sortable: false,
    //   renderHeader: (params) => (
    //     <span className="capitalize font-bold text-xs text-[#535255]">
    //       Expected Date
    //     </span>
    //   ),
    //   width: 200,
    //   renderCell: (params) => {
    //     // const { reportId, id } = params.row;
    //     // const expDate1 = String(
    //     //   params.value === null ? null : params.value.split("T")[0]
    //     // );
    //     // const parts = expDate1.split("/");
    //     // const year = parts[2];
    //     // const month = parts[0];
    //     // const day = parts[1];
    //     // const formattedExpectedDate =
    //     //   params.row.expectedDate !== null
    //     //     ? dayjs(`${year}-${month}-${day}`)
    //     //     : null;
    //     // const expDate =
    //     //   params.row.dateReceived === null || params.row.fileName === null
    //     //     ? formattedExpectedDate
    //     //     : null;

    //     return (
    //       <LocalizationProvider dateAdapter={AdapterDayjs}>
    //         <div className="h-full flex items-center">
    //           <DatePicker
    //             sx={{
    //               height: "30px !important",
    //               // marginTop: "4px",
    //               display: "flex",
    //               alignItems: "center",
    //               flexDirection: "unset",
    //               fontSize: "12px !important",
    //             }}
    //             disablePast
    //             // value={params.value === null ? null : expDate}
    //             slotProps={{
    //               textField: {
    //                 size: "small",
    //               },
    //             }}
    //             // className={`${
    //             //   alert === 2 && highlightedRows.includes(id) ? "error" : ""
    //             // } `}
    //             // onChange={(e) => handleExceptedDate(reportId, e)}
    //           />
    //         </div>
    //       </LocalizationProvider>
    //     );
    //   },
    // },
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
            {/* <span
              className={`h-2 w-2 rounded-full mr-2`}
              style={{
                backgroundColor: getBadgeColor(params.value),
              }}
            ></span> */}
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
          {/* <DescriptionText
            validated={validated}
            planSponserName={planSponserName}
            name={name}
            email={email}
            isTPAAvailableInAnyRow={
              reportDetails.filter(
                (item: transformedDataProps) =>
                  item.description_per_TPA !== null
              ).length > 0
            }
          /> */}
          {validated ? (
            <div className={`mx-auto my-4 flex flex-col px-4 w-full mb-4`}>
              <div
                style={{
                  height: `calc(100vh - 127px - 40px)`,
                  //     - 127px - 116px - 32px - 36px - ${
                  //     alert === 1 || alert === 2 ? "48px" : "0px"
                  //   })`,
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
                  //   slots={{
                  //     noRowsOverlay: CustomNoRowsOverlay,
                  //   }}
                />
              </div>
            </div>
          ) : (
            <>
              <ValidateModel
                email={payload.email}
                pin={payload.pin}
                verifyToken={verifyToken}
                isLoaded={(arg1: boolean) => setLoaded(arg1)}
              />
              {/* <div className="px-4 pt-4 pb-4">
                <Typography className="!text-[14px] !font-normal text-[#333] !font-poppins">
                  Should you have any questions, concerns, or ideas, please
                  contact{" "}
                  <a
                    href="mailto:401kAudit@bdgcpa.com"
                    className="text-[#223E99] underline"
                  >
                    401kAudit@bdgcpa.com
                  </a>
                  .
                </Typography>
                <Typography className="absolute bottom-10 mt-5 !text-[10px] !font-normal text-[#333] !font-poppins">
                  If you are not authorized, please be advised that any review,
                  unauthorized use, dissemination, copyright, or trademark
                  violations are strictly prohibited and will be prosecuted to
                  the fullest extent of the law.
                </Typography>
              </div> */}
            </>
          )}
        </>
      ) : (
        <span className="flex justify-center items-center h-screen">
          <CircularProgress size={40} className="text-[#223E99]" />
        </span>
      )}
      {/* {reportDetails.length > 0 && (
        <div className="px-4 w-full flex justify-end items-center absolute bottom-11">
          <Button
            type="submit"
            variant="contained"
            className="rounded-[4px] !h-[32px] !text-xs !bg-[#223E99] !z-10"
            onClick={handleSubmit}
          >
            Complete Submission
          </Button>
        </div>
      )} */}
      {/* <Footer /> */}
    </div>
  );
}
