"use client";
import { callAPIwithHeaders, callAPIwithParams } from "@/api/commonAPI";
import LinksDialog from "@/components/LinksDialog";
import Wrapper from "@/components/Wrapper";
import Loader from "@/components/common/Loader";
import { Add, MoreVert } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [links, setLinks] = useState<any>([]);
  const [userData, setUserData] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [moreActionsClickedRowId, setmoreActionsClickedRowId] = useState(-1);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactPhone: "",
    roleId: "2",
    isActive: true,
    id: 0,
    password: "",
    isViewMode: false,
  });

  const getManageUserData = (userId: string, isViewMode?: boolean) => {
    const callBack = async (status: boolean, message: string, data: any) => {
      if (status) {
        if (!userId) {
          setLoaded(true);
          setUserData(data);
        } else {
          setUserFormData({
            firstName: data[0].firstName,
            middleName: data[0].middleName,
            lastName: data[0].lastName,
            roleId: data[0].roleId,
            password: data[0].password,
            contactPhone: data[0].contactPhone,
            email: data[0].email,
            id: data[0].id,
            isActive: data[0].isActive,
            isViewMode: isViewMode ? isViewMode : false,
          });
          setmoreActionsClickedRowId(-1);
          setDialogOpen(true);
        }
      } else {
        toast.error(message);
        setLoaded(true);
      }
    };

    callAPIwithParams(
      "/User/Users",
      "post",
      callBack,
      {},
      {
        name: "UserId",
        value: String(userId),
      }
    );
  };

  const sendInvite = (id: number) => {
    setLoaded(false);

    const callBack = async (status: boolean, message: string, data: any) => {
      if (status) {
        setLinks([data.link]);
        setLoaded(true);
        // toast.success(message);
      } else {
        setLoaded(true);
        toast.error(message);
      }
    };

    callAPIwithParams(
      "/ManageUser/SendDocInvite",
      "post",
      callBack,
      {},
      { name: "UserId", value: id.toString() }
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const callBack = async (status: boolean, message: string, data: any) => {
      setDialogOpen(false);
      setUserFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactPhone: "",
        roleId: "2",
        isActive: true,
        id: 0,
        password: "",
        isViewMode: false,
      });
      if (status) {
        toast.success(message);
        getManageUserData("");
      } else {
        toast.error(message);
      }
    };

    callAPIwithHeaders("/User/AddUpdateUser", "post", callBack, userFormData);
  };

  useEffect(() => {
    getManageUserData("");
  }, []);

  const handleClose = () => {
    setDialogOpen(false);
    setUserFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactPhone: "",
      roleId: "2",
      isActive: true,
      id: 0,
      password: "",
      isViewMode: false,
    });
    setEmailError(false);
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Name
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.row.firstName + " " + params.row.lastName}</div>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Email
        </span>
      ),
    },
    {
      field: "contactPhone",
      headerName: "Mobile",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Mobile
        </span>
      ),
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
            className={`${
              params.row.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {params.row.isActive ? "Active" : "Deactive"}
          </div>
        );
      },
    },
    {
      field: "roleId",
      headerName: "Role",
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Role
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.value === 1 ? "Admin" : "Candidate"}</div>;
      },
    },

    {
      field: "id",
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
                  prev !== params.row.id ? params.row.id : -1
                )
              }
            >
              <MoreVert />
            </span>

            {moreActionsClickedRowId === params.row.id && (
              <MoreActions
                onInviteSent={() => sendInvite(params.value)}
                onView={() => {
                  getManageUserData(params.value, true);
                }}
                onEdit={() => {
                  getManageUserData(params.value);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {!loaded && <Loader />}
      <Wrapper>
        <div className="flex-row flex flex-wrap pb-2 justify-between w-full">
          <div className="justify-between flex flex-wrap w-full">
            <div className="justify-start flex items-center font-semibold">
              Manage Users
            </div>

            <Button
              className="flex gap-2"
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              Add User <Add className="text-sm" />
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
              getRowId={(row) => row.id}
              rows={userData}
              columns={columns}
            />
          </div>
        </div>
      </Wrapper>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Enter User Details</DialogTitle>
        <DialogContent className="w-[500px] flex flex-col gap-4">
          <div className="flex gap-2">
            <TextField
              required
              value={userFormData.firstName}
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setUserFormData({ ...userFormData, firstName: e.target.value })
              }
              disabled={userFormData.isViewMode}
            />
            <TextField
              required
              value={userFormData.lastName}
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setUserFormData({ ...userFormData, lastName: e.target.value })
              }
              disabled={userFormData.isViewMode}
            />
          </div>
          <TextField
            required
            value={userFormData.email}
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            error={emailError}
            helperText={emailError ? "Not Valid" : ""}
            onChange={(e) => {
              setEmailError(false);
              setUserFormData({ ...userFormData, email: e.target.value });
            }}
            onBlur={(e) => {
              if (
                !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value.trim())
              ) {
                setEmailError(true);
              }
            }}
            disabled={userFormData.isViewMode}
          />
          <TextField
            required
            value={userFormData.contactPhone}
            id="contactPhone"
            name="contactPhone"
            label="Contact Number"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              if (e.target.value.length >= 10) {
                return;
              } else {
                setUserFormData({
                  ...userFormData,
                  contactPhone: e.target.value,
                });
              }
            }}
            disabled={userFormData.isViewMode}
          />
          <RadioGroup
            className="!flex !flex-row !gap-2"
            value={userFormData.roleId}
            onChange={(e) =>
              setUserFormData({ ...userFormData, roleId: e.target.value })
            }
          >
            <FormControlLabel
              disabled={userFormData.isViewMode}
              value="1"
              control={<Radio />}
              label="Admin"
            />
            <FormControlLabel
              disabled={userFormData.isViewMode}
              value="2"
              control={<Radio />}
              label="Candidate"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
      <LinksDialog
        links={links}
        handleClose={() => {
          setmoreActionsClickedRowId(-1);
          setLinks([]);
        }}
      />
    </>
  );
};

export default Page;

const MoreActions = ({ onInviteSent, onView, onEdit }: any) => {
  const actions = ["send invite", "view", "edit"];
  const actionStyle =
    "flex capitalize text-sm px-6 py-1 cursor-pointer hover:bg-slate-100";

  return (
    <div className="py-2 absolute right-16 bg-white shadow-lg z-10 rounded">
      {actions.map((action: string) => (
        <span
          key={action}
          className={actionStyle}
          onClick={
            action.toLowerCase() === "send invite"
              ? onInviteSent
              : action.toLowerCase() === "view"
              ? onView
              : action.toLowerCase() === "edit"
              ? onEdit
              : undefined
          }
        >
          {action}
        </span>
      ))}
    </div>
  );
};
