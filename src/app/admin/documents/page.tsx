"use client";
//react hooks
import { useEffect, useState } from "react";
//3rd party libraries
import { toast } from "react-toastify";
import { TablePagination, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
//custom components & icons
import Wrapper from "@/components/Wrapper";
import Loader from "@/components/common/Loader";
import Close from "@/assets/icons/Close";
import SearchIcon from "@/assets/icons/SearchIcon";
import ArrowRight from "@/assets/icons/ArrowRight";
import { FolderIcon, XLSXIcon, PDFIcon } from "@/assets/icons/DocumentIcons";
// common types, variables & functions
import { initialBody } from "@/static/documents/commonVariables";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import { callAPIwithHeaders } from "@/api/commonAPI";
import {
  BreadCrumbListProps,
  DocumentProps,
  InitialBodyProps,
} from "@/types/Documents";

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

  const getDocuments = async (initialBody: InitialBodyProps): Promise<void> => {
    setLoaded(false);
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

    const callBack = async (
      status: boolean,
      message: string,
      data: any
    ): Promise<void> => {
      if (status && !!data.data) {
        if (data.data.length === 0) {
          setLoaded(true);
          setDocumentData([]);
        } else {
          setLoaded(true);
          setDocumentData(
            data.data.map((data: DocumentProps) => ({
              ...data,
              filesCount: data.count.split(" ")[0],
              foldersCount: data.count.split(" ")[2],
            }))
          );
        }
        setTotalCount(data.totalCount);
      } else if (status && !data.data) {
        setLoaded(true);
        downloadFileFromBase64(
          data,
          !!initialBody.folderName ? String(initialBody.folderName) : "doc"
        );
      } else {
        setLoaded(true);
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

  const getDocumentIcon = (documentType: string): React.ReactNode => {
    switch (documentType.toLowerCase()) {
      case "xlsx":
      case "xls":
      case "csv":
        return <XLSXIcon />;
      case "pdf":
        return <PDFIcon />;
      case "docx":
      case "doc":
        return "";
      case "txt":
        return "";
    }
  };

  const handleBreadCrumbClick = (
    index: number,
    list: BreadCrumbListProps
  ): void => {
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

  const handleSearch = (isClearing?: boolean): void => {
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
            className={`h-12 select-none flex items-center gap-5 text-sm font-normal text-[#333] ${
              parseInt(params.row.count.split(" ")[2]) === 0 &&
              parseInt(params.row.count.split(" ")[0]) === 0 &&
              params.row.type === 0
                ? "pointer-events-none"
                : "cursor-pointer"
            } ${
              params.value.length > 0
                ? "cursor-pointer"
                : "cursor-not-allowed pointer-events-none"
            }`}
            onClick={() => {
              setPageNo(0);
              setRowsPerPage(10);
              getDocuments({
                ...initialBody,
                id: documentData.filter(
                  (data) =>
                    data.name.toLowerCase() === params.row.name.toLowerCase()
                )[0].id,
                folderName: params.row.name,
                type: params.row.type,
              });
            }}
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

  useEffect(() => {
    getDocuments(initialBody);
  }, []);

  return (
    <>
      {!loaded && <Loader />}
      <Wrapper>
        <HeaderComponent
          breadCrumbList={breadCrumbList}
          handleBreadCrumbClick={handleBreadCrumbClick}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleSearch={handleSearch}
        />
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
              slots={{
                footer: () => (
                  <div className="flex justify-end">
                    <TablePagination
                      count={totalCount}
                      page={pageNo}
                      onPageChange={handlePageChange}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default Page;

type HeaderComponentProps = {
  breadCrumbList: BreadCrumbListProps[];
  handleBreadCrumbClick: (index: number, list: BreadCrumbListProps) => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (isClearing?: boolean) => void;
};

const HeaderComponent = ({
  breadCrumbList,
  handleBreadCrumbClick,
  searchValue,
  setSearchValue,
  handleSearch,
}: HeaderComponentProps) => {
  return (
    <div className="flex-row flex flex-wrap pb-2 justify-between w-full">
      <div className="justify-between flex flex-wrap w-full">
        {/* Bread Crumb */}
        <div className="justify-start flex items-center w-[70%] flex-wrap">
          {breadCrumbList.map((list: BreadCrumbListProps, index: number) => (
            <>
              <span
                className="!text-[14px] font-semibold capitalize cursor-pointer"
                onClick={() => handleBreadCrumbClick(index, list)}
              >
                {list.label ?? "documents"}
              </span>
              {index !== breadCrumbList.length - 1 && <ArrowRight />}
            </>
          ))}
        </div>
        {/* search bar */}
        <div className="justify-end flex flex-row">
          <span className="mr-5 flex items-center relative border-b border-b-black focus-within:border-b-[#223E99] hover:border-b-2 focus-within:border-b-2">
            <div className="w-[75%]">
              <TextField
                variant="standard"
                placeholder="Search"
                value={searchValue}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleSearch(false);
                  }
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
  );
};
