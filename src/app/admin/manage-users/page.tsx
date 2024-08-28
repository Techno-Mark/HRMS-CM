"use client";
//react hooks
import { ChangeEvent, useEffect, useRef, useState } from "react";
//3rd party libraries & icons
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
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
import Close from "@/assets/icons/Close";
import SearchIcon from "@/assets/icons/SearchIcon";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const RoleOptions = [
  { value: 2, label: "Candidate" },
  { value: 3, label: "Employee" },
];

const StatusOptions = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const DocumentStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Submitted" },
  { value: 2, label: "Completed" },
];

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
    EmployeeCode: "",
    isActive: true,
    id: 0,
    password: "",
    isViewMode: false,
  });
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    userId: null,
    roleId: null,
    search: "",
    activeStatus: null,
    DocumentStatus: null,
  });

  const getManageUserData = (userId: string, isViewMode?: boolean): void => {
    setLoaded(false);

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
            EmployeeCode: data[0].employeeCode,
          });
          setmoreActionsClickedRowId(-1);
          setDialogOpen(true);
          setLoaded(true);
        }
      } else {
        toast.error(message);
        setLoaded(true);
      }
    };

    callAPIwithHeaders("/ManageUser/GetManageUser", "post", callBack, {
      userId: !userId ? null : userId,
      roleId: !filter.roleId ? null : filter.roleId,
      search: isViewMode || !filter.search ? null : filter.search,
      activeStatus:
        filter.activeStatus === null ? null : Boolean(filter.activeStatus),
      DocumentStatus:
        filter.DocumentStatus === null ? null : filter.DocumentStatus,
    });
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

    callAPIwithHeaders("/User/AddUpdateUser", "post", callBack, {
      firstName: !userFormData.firstName ? null : userFormData.firstName,
      middleName: !userFormData.middleName ? null : userFormData.middleName,
      lastName: !userFormData.lastName ? null : userFormData.lastName,
      email: !userFormData.email ? null : userFormData.email,
      contactPhone: !userFormData.contactPhone
        ? null
        : userFormData.contactPhone,
      roleId: !userFormData.roleId ? null : userFormData.roleId,
      EmployeeCode: !userFormData.EmployeeCode
        ? null
        : userFormData.EmployeeCode,
      isActive: userFormData.isActive,
      id: userFormData.id,
      password: !userFormData.password ? null : userFormData.password,
    });
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
      EmployeeCode: "",
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
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/.test(
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

  const handleUserStatusChange = (userId: number) => {
    const callBack = async (
      status: boolean,
      message: string
    ): Promise<void> => {
      if (status) {
        toast.success(message);
        setLoaded(true);
        setmoreActionsClickedRowId(-1);
        getManageUserData("");
      } else {
        toast.error(message);
        setLoaded(true);
        setmoreActionsClickedRowId(-1);
        getManageUserData("");
      }
    };

    callAPIwithHeaders("/ManageUser/InactiveUser", "post", callBack, {
      userId: userId,
    });
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
        const currentName =
          params.row.middleName === null || params.row.middleName == ""
            ? params.row.firstName + " " + params.row.lastName
            : params.row.firstName +
              " " +
              params.row.middleName +
              " " +
              params.row.lastName;
        return <div>{currentName}</div>;
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
            {params.row.isActive ? "Active" : "Inactive"}
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
      field: "roleName",
      headerName: "Role",
      sortable: false,
      flex: 1,
      renderHeader: (params) => (
        <span className="capitalize font-semibold text-sm text-[#535255]">
          Role
        </span>
      ),
      renderCell: (params) => {
        return <div>{params.value}</div>;
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
                  params.row.userDocStatus.toLowerCase() === "completed" ||
                  params.row.userDocStatus.toLowerCase() === "submitted"
                }
                isInvitationSent={params.row.isInvitationSent}
                isActive={params.row.isActive}
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
                onStatusChange={() => handleUserStatusChange(params.value)}
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
        <HeaderComponent
          value={filter.search}
          setSearchValue={setFilter}
          setFilterOpen={setFilterOpen}
          setDialogOpen={setDialogOpen}
          handleSearch={(isClearing: boolean) =>
            getManageUserData("", isClearing)
          }
        />
        <div className="mx-auto flex flex-col w-full mt-4">
          <div className="tableStyle">
            <DataGrid
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                fontSize: "12px",
                height: "72vh",
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
        <FilterPopup
          setFilterOpen={setFilterOpen}
          isFilterOpen={filterOpen}
          filter={filter}
          setFilter={setFilter}
          handleSubmit={() => getManageUserData("")}
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
  onStatusChange: () => void;
  isInvitationSent: boolean;
  isCompleted: boolean;
  isActive: boolean;
  link: string | null;
};

const MoreActions = ({
  link,
  onInviteSent,
  onView,
  onEdit,
  onRemind,
  onStatusChange,
  isInvitationSent,
  isActive,
  isCompleted,
  onOutsideClick,
}: MoreActionsType) => {
  const divRef = useRef<any>(null);
  const activeUserActions = [
    "view",
    "edit",
    "Mark as inactive",
    "send invite",
    "send reminder",
    "copy invitation link",
  ];
  const inActiveUserActions = [
    "view",
    "edit",
    "Mark as active",
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
      {(isActive ? activeUserActions : inActiveUserActions).map(
        (action: string, index: number) => (
          <span
            key={action}
            className={`${actionStyle} 
            ${
              isCompleted && (index === 5 || index === 4 || index === 3)
                ? "pointer-events-none opacity-50"
                : ""
            }
            ${
              index === 5 && !isInvitationSent
                ? "pointer-events-none opacity-50"
                : ""
            }
            ${
              index === 4 && !isInvitationSent
                ? "pointer-events-none opacity-50"
                : ""
            } ${
              index === 3 && isInvitationSent
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
                : action.toLowerCase() === "mark as inactive" ||
                  action.toLowerCase() === "mark as active"
                ? onStatusChange
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
        )
      )}
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
          {userFormData.roleId == "3" && (
            <TextField
              required
              value={userFormData.EmployeeCode}
              id="empCode"
              name="empCode"
              label="Employee Code"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                if (
                  !/^[0-9]*$/.test(e.target.value) ||
                  e.target.value.length > 4
                ) {
                  return;
                } else {
                  setUserFormData({
                    ...userFormData,
                    EmployeeCode: e.target.value.trim(),
                  });
                }
              }}
              disabled={userFormData.isViewMode}
            />
          )}
          <TextField
            required
            value={userFormData.firstName}
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setUserFormData({
                ...userFormData,
                firstName: e.target.value.trim(),
              });
            }}
            disabled={userFormData.isViewMode}
          />
          {userFormData.roleId != "3" && (
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
                  middleName: e.target.value.trim(),
                })
              }
              disabled={userFormData.isViewMode}
            />
          )}
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
              setUserFormData({
                ...userFormData,
                lastName: e.target.value.trim(),
              })
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
                contactPhone: e.target.value.trim(),
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
          <FormControlLabel
            disabled={userFormData.isViewMode}
            value="3"
            control={<Radio />}
            label="Employee"
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
  value: string;
  setSearchValue: React.Dispatch<React.SetStateAction<any>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: (arg1: boolean) => void;
};

const HeaderComponent = ({
  value,
  setSearchValue,
  setFilterOpen,
  setDialogOpen,
  handleSearch,
}: HeaderComponent) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="mr-5 flex items-center relative border-b border-b-black focus-within:border-b-[#223E99]">
          <TextField
            className="!w-44 pr-12"
            variant="standard"
            placeholder="Search"
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(false);
              }
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearchValue((prevFilter: any) => ({
                ...prevFilter,
                search: e.target.value,
              }));
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />
          {value.length > 0 && (
            <span
              className="absolute right-7 top-2.5 cursor-pointer"
              onClick={() => {
                setSearchValue((prevFilter: any) => ({
                  ...prevFilter,
                  search: "",
                }));
                handleSearch(true);
              }}
            >
              <Close />
            </span>
          )}
          <span
            className={`absolute right-1.5 top-2.5 ${
              true ? "cursor-pointer" : "pointer-events-none"
            }`}
            onClick={() => handleSearch(false)}
          >
            <SearchIcon />
          </span>
        </span>
        <span
          className="mt-2 cursor-pointer"
          onClick={() => setFilterOpen(true)}
        >
          <Tooltip title="Filter">
            <FilterAltIcon />
          </Tooltip>
        </span>
      </div>

      <div className="justify-end flex flex-wrap w-full">
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

const FilterPopup = ({
  isFilterOpen,
  filter,
  setFilter,
  setFilterOpen,
  handleSubmit,
}: any) => {
  const handleDropDownChange = (record: any, field: string) => {
    if (record === null) {
      setFilter({ ...filter, [field]: null });
    } else {
      setFilter({ ...filter, [field]: record.value });
    }
  };

  const handleReset = () => {
    setFilter({
      userId: null,
      roleId: null,
      search: "",
      activeStatus: null,
      DocumentStatus: null,
    });
  };

  return (
    <Dialog open={isFilterOpen}>
      <DialogTitle className="flex justify-between">
        <span>Filter</span>
        <Tooltip title="Close">
          <Button color="error" onClick={() => setFilterOpen(false)}>
            <Close size={1.25} />
          </Button>
        </Tooltip>
      </DialogTitle>
      <DialogContent className="w-[500px] flex flex-col gap-4">
        <div className="my-4 flex flex-col gap-4">
          <Autocomplete
            options={RoleOptions}
            renderInput={(params) => <TextField {...params} label="Role" />}
            value={RoleOptions.find((item) => item.value === filter.roleId)}
            onChange={(e, record) => handleDropDownChange(record, "roleId")}
          />
          <Autocomplete
            options={StatusOptions}
            renderInput={(params) => <TextField {...params} label="Status" />}
            value={StatusOptions.find(
              (item) => item.value === filter.activeStatus
            )}
            onChange={(e, record) =>
              handleDropDownChange(record, "activeStatus")
            }
          />
          <Autocomplete
            options={DocumentStatusOptions}
            renderInput={(params) => (
              <TextField {...params} label="Document Status" />
            )}
            value={DocumentStatusOptions.find(
              (item) => item.value === filter.DocumentStatus
            )}
            onChange={(e, record) =>
              handleDropDownChange(record, "DocumentStatus")
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleReset}>
          Reset
        </Button>
        <Button
          type="button"
          onClick={() => {
            handleSubmit();
            setFilterOpen(false);
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
