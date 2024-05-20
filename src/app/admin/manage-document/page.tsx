"use client";
import { callAPIwithHeaders, callAPIwithParams } from "@/api/commonAPI";
import Wrapper from "@/components/Wrapper";
import { Add, MoreVert } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [moreActionsClickedRowId, setmoreActionsClickedRowId] = useState(-1);
  const [formData, setFormData] = useState({
    documentId: 0,
    documentName: "",
    isActive: false,
    isMandatory: false,
  });

  const addupdateForm = () => {
    const callBack = async (status: boolean, message: string, data: any) => {
      if (status) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    };

    callAPIwithHeaders(
      "/Document/AddUpdateDocument",
      "post",
      callBack,
      formData
    );
  };

  const handleDialogClose = () => {
    setmoreActionsClickedRowId(-1);
    setDialogOpen(false);
    setFormData({
      documentId: 0,
      documentName: "",
      isActive: false,
      isMandatory: false,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "documentName",
      headerName: "Document Name",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Document Name
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.value}</div>;
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Status
        </span>
      ),
      renderCell: (params) => {
        return (
          <div
            className={`${params.value ? "text-green-600" : "text-red-600"}`}
          >
            {params.value ? "Active" : "Deactive"}
          </div>
        );
      },
    },
    {
      field: "isMandatory",
      headerName: "Required",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Required
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.value ? "Yes" : "No"}</div>;
      },
    },
    {
      field: "documentId",
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
              className={`relative cursor-pointer`}
              onClick={() =>
                setmoreActionsClickedRowId((prev) =>
                  prev !== params.row.documentId ? params.row.documentId : -1
                )
              }
            >
              <MoreVert />
            </span>
            {moreActionsClickedRowId === params.row.documentId && (
              <MoreActions
                onEdit={() => {
                  setFormData({
                    ...formData,
                    documentId: params.value,
                    documentName: params.row.documentName,
                    isActive: true,
                    isMandatory: true,
                  });
                  setDialogOpen(true);
                }}
                onDelete={undefined}
              />
            )}
          </div>
        );
      },
    },
  ];

  const getFormData = (id: string) => {
    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        setData(data);
      }
    };

    callAPIwithParams(
      "/Document/GetDocuments",
      "post",
      callBack,
      {},
      { name: "DocumentId", value: id }
    );
  };

  useEffect(() => {
    getFormData("");
  }, []);

  return (
    <Wrapper>
      <div className="flex-row flex flex-wrap pb-2 justify-between w-full">
        <div className="justify-between flex flex-wrap w-full">
          <div className="justify-start flex items-center font-semibold">
            Manage Document
          </div>

          <Button
            className="flex gap-2"
            variant="contained"
            onClick={() => setDialogOpen(true)}
          >
            Add document <Add className="text-sm" />
          </Button>
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
            columns={columns}
            getRowId={(row) => row.documentId}
            rows={data}
          />
        </div>
      </div>
      <Form
        formData={formData}
        isDialogOpen={isDialogOpen}
        setFormData={setFormData}
        handleSubmit={addupdateForm}
        handleClose={handleDialogClose}
      />
    </Wrapper>
  );
};

export default Page;

const Form = ({
  formData,
  isDialogOpen,
  setFormData,
  handleSubmit,
  handleClose,
}: any) => {
  const options = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Set your document prefrence</DialogTitle>
        <DialogContent className="w-[500px] flex flex-col gap-4">
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.documentName}
            variant="standard"
            onChange={(e) =>
              setFormData((formData: any) => ({
                ...formData,
                documentName: e.target.value,
              }))
            }
          />
          <Autocomplete
            disableClearable
            options={options}
            value={
              options.filter((item) => item.value === formData.isMandatory)[0]
            }
            onChange={(e, record: any) => {
              if (record !== null) {
                setFormData((formData: any) => ({
                  ...formData,
                  isMandatory: record.value,
                }));
              } else {
                setFormData((formData: any) => ({
                  ...formData,
                  isMandatory: false,
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mandatory"
                variant="standard"
                required
              />
            )}
          />
          <Autocomplete
            disableClearable
            options={options}
            value={
              options.filter((item) => item.value === formData.isActive)[0]
            }
            onChange={(e, record: any) => {
              if (record !== null) {
                setFormData((formData: any) => ({
                  ...formData,
                  isActive: record.value,
                }));
              } else {
                setFormData((formData: any) => ({
                  ...formData,
                  isActive: false,
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Active"
                variant="standard"
                required
              />
            )}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border resize-none outline-none rounded-md"
            rows={4}
            id="description"
          >
            {formData.description}
          </textarea>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const MoreActions = ({ onEdit, onDelete }: any) => {
  const actions = ["edit", "delete"];
  const actionStyle =
    "flex capitalize text-sm px-6 py-1 cursor-pointer hover:bg-slate-100";

  const getStatus = (action: string) => {
    switch (action.toLowerCase()) {
      case "edit":
        onEdit();
        break;
      case "delete":
        onDelete();
        break;
      default:
        undefined;
        break;
    }
  };

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
