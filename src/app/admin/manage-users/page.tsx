"use client";
//react hooks
import { useEffect, useRef, useState } from "react";
//3rd party libraries & icons
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add, MoreVert, Visibility, VisibilityOff } from "@mui/icons-material";
//custom components
import Wrapper from "@/components/Wrapper";
import Loader from "@/components/common/Loader";
// common types, variables & functions
import { callAPIwithHeaders, callAPIwithParams } from "@/api/commonAPI";
import { UserDataType, UserFormDataType } from "@/types/ManageUsers";
import { toastOptions } from "@/static/toastOptions";
import LinksDialog from "@/components/LinksDialog";

const Page = () => {
  const [links, setLinks] = useState<any>([]);
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [moreActionsClickedRowId, setmoreActionsClickedRowId] =
    useState<number>(-1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [pwdErr, setPwdErr] = useState<boolean>(false);
  const [userFormData, setUserFormData] = useState<UserFormDataType>({
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

  const getManageUserData = (userId: string, isViewMode?: boolean): void => {
    const callBack = async (
      status: boolean,
      message: string,
      data: any
    ): Promise<void> => {
      if (status) {
        if (!userId) {
          setLoaded(true);
          setUserData(data);
        } else {
          setUserFormData({
            ...data[0],
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
      "/ManageUser/GetManageUser",
      "post",
      callBack,
      {},
      {
        name: "UserId",
        value: String(userId),
      }
    );
  };

  const sendInvite = (id: number): void => {
    setLoaded(false);

    const callBack = async (
      status: boolean,
      message: string,
      data: { link: string }
    ): Promise<void> => {
      if (status) {
        setLinks([data.link]);
        setLoaded(true);
        toast.success(message);
        setmoreActionsClickedRowId(-1);
        getManageUserData("");
      } else {
        setLinks([]);
        setLoaded(true);
        toast.error(message);
        setmoreActionsClickedRowId(-1);
        getManageUserData("");
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (ifValidationErrorExists()) {
      return;
    }

    const callBack = async (
      status: boolean,
      message: string,
      data: any
    ): Promise<void> => {
      handleClose();
      if (status) {
        toast.success(message);
        getManageUserData("");
      } else {
        toast.error(message);
      }
    };

    callAPIwithHeaders("/User/AddUpdateUser", "post", callBack, userFormData);
  };

  const sendReminder = (userId: string): void => {
    const callBack = async (
      status: boolean,
      message: string
    ): Promise<void> => {
      if (status) {
        toast.success(message);
        setLoaded(true);
        setmoreActionsClickedRowId(-1);
      } else {
        toast.error(message);
        setLoaded(true);
        setmoreActionsClickedRowId(-1);
      }
    };

    callAPIwithParams(
      "/Document/SendReminder",
      "post",
      callBack,
      {},
      {
        name: "UserId",
        value: String(userId),
      }
    );
  };

  const handleClose = (): void => {
    setPwdErr(false);
    setEmailError(false);
    setPhoneError(false);
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
  };

  const ifValidationErrorExists = (): boolean => {
    //if email contains error
    if (emailError) {
      return true;
    }

    //contact number contains error
    if (userFormData.contactPhone.trim().length < 10) {
      setPhoneError(true);
      return true;
    } else {
      setPhoneError(false);
    }

    //if password field contains error
    if (
      userFormData.roleId === "1" &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        userFormData.password
      )
    ) {
      setPwdErr(true);
      return true;
    } else {
      setPwdErr(false);
    }

    //no validation error
    return false;
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Name",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Name
        </span>
      ),
      renderCell: (params) => {
        return (
          <div>
            {params.row.firstName +
              " " +
              params.row.middleName +
              " " +
              params.row.lastName}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
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
      sortable: false,
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
      sortable: false,
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
      field: "userDocStatus",
      headerName: "Document Status",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Document Status
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.value}</div>;
      },
    },
    {
      field: "roleId",
      headerName: "Role",
      sortable: false,
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
              onClick={() => {
                setmoreActionsClickedRowId((prev) =>
                  prev !== params.row.id ? params.row.id : -1
                );
              }}
            >
              <MoreVert />
            </span>

            {moreActionsClickedRowId === params.row.id && (
              <MoreActions
                link={params.row.link}
                isCompleted={
                  params.row.userDocStatus.toLowerCase() === "completed"
                }
                isInvitationSent={params.row.isInvitationSent}
                onInviteSent={() => sendInvite(params.value)}
                onView={() => {
                  getManageUserData(params.value, true);
                }}
                onEdit={() => {
                  getManageUserData(params.value);
                }}
                onRemind={() => {
                  sendReminder(params.value);
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
    getManageUserData("");
  }, []);

  return (
    <>
      {!loaded && <Loader />}
      <Wrapper>
        <HeaderComponent setDialogOpen={setDialogOpen} />
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
                ".css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone": {
                  paddingBottom: "60px",
                },
              }}
              getRowId={(row) => row.id}
              rows={userData}
              columns={columns}
            />
          </div>
        </div>
        <UserFormDialog
          dialogOpen={dialogOpen}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          userFormData={userFormData}
          setUserFormData={setUserFormData}
          emailError={emailError}
          setEmailError={setEmailError}
          phoneError={phoneError}
          setPhoneError={setPhoneError}
          showPassword={showPassword}
          pwdErr={pwdErr}
          setShowPassword={setShowPassword}
          setPwdErr={setPwdErr}
        />
        <LinksDialog
          links={links}
          handleClose={() => {
            setmoreActionsClickedRowId(-1);
            setLinks([]);
          }}
        />
      </Wrapper>
    </>
  );
};

export default Page;

type MoreActionsType = {
  onInviteSent: () => void;
  onView: () => void;
  onEdit: () => void;
  onRemind: () => void;
  onOutsideClick: () => void;
  isInvitationSent: boolean;
  isCompleted: boolean;
  link: string | null;
};

const MoreActions = ({
  link,
  onInviteSent,
  onView,
  onEdit,
  onRemind,
  isInvitationSent,
  isCompleted,
  onOutsideClick,
}: MoreActionsType) => {
  const divRef = useRef<any>(null);
  const actions = [
    "view",
    "edit",
    "send invite",
    "send reminder",
    "copy invitation link",
  ];
  const actionStyle =
    "flex capitalize text-sm px-6 py-1 cursor-pointer hover:bg-slate-100";

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
      {actions.map((action: string, index: number) => (
        <span
          key={action}
          className={`${actionStyle} 
            ${
              isCompleted && (index === 4 || index === 3 || index === 2)
                ? "pointer-events-none opacity-50"
                : ""
            }
            ${
              index === 4 && !isInvitationSent
                ? "pointer-events-none opacity-50"
                : ""
            }
            ${
              index === 3 && !isInvitationSent
                ? "pointer-events-none opacity-50"
                : ""
            } ${
            index === 2 && isInvitationSent
              ? "pointer-events-none opacity-50"
              : ""
          }`}
          onClick={
            action.toLowerCase() === "send invite"
              ? onInviteSent
              : action.toLowerCase() === "view"
              ? onView
              : action.toLowerCase() === "edit"
              ? onEdit
              : action.toLowerCase() === "send reminder"
              ? onRemind
              : action.toLowerCase() === "copy invitation link"
              ? async () => {
                  navigator.clipboard.writeText(
                    `${process.env.app_url}/request?id=${link}`
                  );
                  toast.success(
                    `Validate Code copied sucessfully`,
                    toastOptions
                  );
                }
              : undefined
          }
        >
          {action}
        </span>
      ))}
    </div>
  );
};

type UserFormDialogType = {
  dialogOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  userFormData: UserFormDataType;
  setUserFormData: React.Dispatch<React.SetStateAction<UserFormDataType>>;
  emailError: boolean;
  setEmailError: React.Dispatch<React.SetStateAction<boolean>>;
  phoneError: boolean;
  setPhoneError: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  pwdErr: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setPwdErr: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserFormDialog = ({
  dialogOpen,
  handleClose,
  handleSubmit,
  userFormData,
  setUserFormData,
  emailError,
  setEmailError,
  phoneError,
  setPhoneError,
  showPassword,
  pwdErr,
  setShowPassword,
  setPwdErr,
}: UserFormDialogType) => {
  return (
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
              setUserFormData({
                ...userFormData,
                firstName: e.target.value,
              })
            }
            disabled={userFormData.isViewMode}
          />
          <TextField
            required
            value={userFormData.middleName}
            id="middleName"
            name="middleName"
            label="Middle Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) =>
              setUserFormData({
                ...userFormData,
                middleName: e.target.value,
              })
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
          autoComplete="new-email"
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
          error={phoneError}
          helperText={
            phoneError && "Please enter valid 10 digit contact number"
          }
          onChange={(e) => {
            setPhoneError(false);
            if (e.target.value.length > 10) {
              return;
            } else if (!/^[0-9\s]*$/.test(e.target.value)) {
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
          className={`!flex !flex-row !gap-2 select-none ${
            userFormData.id > 0 ? "pointer-events-none opacity-50" : ""
          }`}
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
        {userFormData.roleId === "1" && (
          <TextField
            autoComplete="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={userFormData.password}
            error={pwdErr}
            helperText={
              pwdErr &&
              "Password must be a minimum of eight characters and include a mix of numbers, uppercase, lowercase letters, and special characters."
            }
            onChange={(e) => {
              setPwdErr(false);
              setUserFormData({ ...userFormData, password: e.target.value });
            }}
            label="Password"
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

type HeaderComponent = {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderComponent = ({ setDialogOpen }: HeaderComponent) => {
  return (
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
  );
};
