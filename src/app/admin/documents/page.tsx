"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import Wrapper from "@/components/Wrapper";
import Loader from "@/components/common/Loader";
import SearchIcon from "@/assets/icons/SearchIcon";
import ArrowRight from "@/assets/icons/ArrowRight";
import { FolderIcon, XLSXIcon, PDFIcon } from "@/assets/icons/DocumentIcons";
import { initialBody } from "@/static/documents/commonVariables";
import { callAPIwithHeaders } from "@/api/commonAPI";
import Close from "@/assets/icons/Close";
import {
  BreadCrumbListProps,
  DocumentProps,
  InitialBodyProps,
} from "@/types/Documents";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";

function Page() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [documentData, setDocumentData] = useState<DocumentProps[]>([]);
  const [breadCrumbList, setBreadCrumbList] = useState<BreadCrumbListProps[]>([
    { id: null, label: null },
  ]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      hideable: false,
      sortable: false,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Name
        </span>
      ),
      renderCell: (params) => {
        const docType = params.value.split(".");
        return (
          <span
            className="h-12 flex items-center gap-5 text-sm font-normal text-[#333] cursor-pointer"
            onClick={
              params.value.length > 0
                ? () => {
                    setPageNo(0);
                    setRowsPerPage(10);
                    getDocuments({
                      ...initialBody,
                      id: documentData.filter(
                        (data) =>
                          data.name.toLowerCase() ===
                          params.row.name.toLowerCase()
                      )[0].id,
                      folderName: params.row.name,
                      type: params.row.type,
                    });
                  }
                : undefined
            }
          >
            {params.row.type === 0 ? (
              <FolderIcon />
            ) : (
              getDocumentIcon(docType[docType.length - 1])
            )}
            {params.value}
          </span>
        );
      },
    },
    {
      field: "updatedOn",
      headerName: "Last Updated",
      width: 200,
      sortable: false,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          {documentData.filter((data) => data.type === 0).length > 0
            ? "Updated Date"
            : "Upload Date"}
        </span>
      ),
      renderCell: (params) => {
        return (
          <span className="h-12 flex items-center gap-1 text-sm font-normal text-[#333]">
            {params.value.split(" ")[0]}
            &nbsp;|&nbsp;
            {params.value.split(" ")[1]}
          </span>
        );
      },
    },
    documentData.filter((data) => data.type === 0).length > 0
      ? {
          field: "count",
          headerName: "Documents",
          flex: 1,
          sortable: false,
          renderHeader: (params) => (
            <span className="capitalize font-semibold text-sm text-[#535255]">
              Documents
            </span>
          ),
          renderCell: (params) => {
            const folders = params.value.split(" ")[0];
            const files = params.value.split(",")[1];
            const filesCount = files.trim().split(" ")[0];

            return (
              <span className="text-sm font-normal text-[#333]">
                {params.row.type === 1
                  ? "-"
                  : parseInt(folders) > 0
                  ? params.value
                  : files}
              </span>
            );
          },
        }
      : {
          field: "size",
          headerName: "File Size",
          width: 100,
          sortable: false,
          renderHeader: (params) => (
            <span className="capitalize font-semibold text-sm text-[#535255]">
              File Size
            </span>
          ),
          renderCell: (params) => {
            return (
              <span className="text-sm font-normal text-[#333]">
                {params.row.type === 0 ? "-" : `${params.value} MB`}
              </span>
            );
          },
        },
  ];

  const getDocuments = async (initialBody: InitialBodyProps) => {
    if (initialBody.folderName !== null && initialBody.type === 0) {
      if (
        !(
          breadCrumbList.filter(
            (list: BreadCrumbListProps) => list.id === initialBody.id
          ).length > 0
        )
      ) {
        setBreadCrumbList([
          ...breadCrumbList,
          { id: initialBody.id, label: String(initialBody.folderName) },
        ]);
      }
    }
    const callBack = async (status: boolean, message: string, data: any) => {
      if (status && !!data.data) {
        if (data.data.length === 0) {
          setDocumentData([]);
        } else {
          setDocumentData(
            data.data.map((data: DocumentProps) => ({
              ...data,
              filesCount: data.count.split(" ")[0],
              foldersCount: data.count.split(" ")[2],
            }))
          );
        }
        setTotalCount(data.totalCount);
        setLoaded(true);
      } else if (status && !data.data) {
        downloadFileFromBase64(
          data,
          !!initialBody.folderName ? String(initialBody.folderName) : "doc"
        );
      } else {
        toast.error(message);
        setLoaded(true);
      }
    };

    callAPIwithHeaders(
      "/Document/GetAllContainers",
      "post",
      callBack,
      initialBody
    );
  };

  useEffect(() => {
    getDocuments(initialBody);
  }, []);

  const getDocumentIcon = (documentType: string) => {
    switch (documentType.toLowerCase()) {
      case "xlsx":
        return <XLSXIcon />;
      case "xls":
        return <XLSXIcon />;
      case "csv":
        return <XLSXIcon />;
      case "pdf":
        return <PDFIcon />;
      case "docx":
        return "";
      case "doc":
        return "";
      case "txt":
        return "";
    }
  };

  const handleBreadCrumbClick = (index: number, list: BreadCrumbListProps) => {
    const newArray = breadCrumbList.slice(0, index + 1);
    setBreadCrumbList(newArray);
    setPageNo(0);
    setRowsPerPage(10);
    getDocuments({
      ...initialBody,
      id: list.id,
      folderName: list.label,
    });
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNo: number
  ) => {
    setPageNo(pageNo);
    getDocuments({
      ...initialBody,
      id:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].id,
      folderName:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].label,
      PageNo: pageNo + 1,
      PageSize: rowsPerPage,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNo(0);
    setRowsPerPage(parseInt(event.target.value));
    getDocuments({
      ...initialBody,
      id:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].id,
      folderName:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].label,
      PageSize: event.target.value,
    });
  };

  const handleSearch = (isClearing?: boolean) => {
    getDocuments({
      ...initialBody,
      id:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].id,
      folderName:
        breadCrumbList.length === 1
          ? null
          : breadCrumbList[breadCrumbList.length - 1].label,
      Search: isClearing ? "" : searchValue,
    });
  };

  return (
    <>
      {!loaded && <Loader />}
      <Wrapper>
        <div className="flex-row flex flex-wrap pb-2 justify-between w-full">
          <div className="justify-between flex flex-wrap w-full">
            <div className="justify-start flex items-center">
              {breadCrumbList.map(
                (list: BreadCrumbListProps, index: number) => (
                  <>
                    <span
                      className="!text-[14px] font-semibold capitalize cursor-pointer"
                      onClick={() => handleBreadCrumbClick(index, list)}
                    >
                      {list.label ?? "documents"}
                    </span>
                    {index !== breadCrumbList.length - 1 && <ArrowRight />}
                  </>
                )
              )}
            </div>
            <div className="justify-end flex flex-row">
              <span className="mr-5 flex items-center relative border-b border-b-black focus-within:border-b-[#223E99] hover:border-b-2 focus-within:border-b-2">
                <div className="w-[75%]">
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchValue(e.target.value)
                    }
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </div>
                {searchValue.length > 0 && (
                  <span
                    className="absolute right-8 top-1.5 cursor-pointer"
                    onClick={() => {
                      setSearchValue("");
                      handleSearch(true);
                    }}
                  >
                    <Close />
                  </span>
                )}
                <span
                  className={`absolute right-2 top-1.5 ${
                    searchValue.length > 0
                      ? "cursor-pointer"
                      : "pointer-events-none"
                  }`}
                  onClick={() => handleSearch(false)}
                >
                  <SearchIcon />
                </span>
              </span>
            </div>
          </div>
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
              getRowId={(row) => row.id}
              rows={documentData}
              columns={columns}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default Page;
