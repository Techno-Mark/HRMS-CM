import {
  Badge,
  Avatar,
  styled,
  Toolbar,
  IconButton,
  AppBar as MuiAppBar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
} from "@mui/icons-material";

import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import ArrowUp from "@/assets/icons/ArrowUp";
import ArrowDown from "@/assets/icons/ArrowDown";
import NotificationIcon from "@/assets/icons/NotificationIcon";

import { removeCookies } from "@/utils/authFunctions";
import { drawerWidth } from "@/static/commonVariables";
import { AppBarProps, HeaderPropsType, Option } from "@/types/AdminHeader";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ openSidebar }: HeaderPropsType) => {
  const router = useRouter();
  const query = usePathname();
  const url = query.split("/");
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState<string>("User");

  useEffect(() => {
    const userInfo = JSON.parse(Cookies.get("userInfo") ?? "");
    if (!userInfo) {
      router.push("/");
    } else {
      setName(userInfo.firstName + " " + userInfo.lastName);
    }
  }, []);

  const options: Option[] = [
    {
      id: 1,
      label: "Logout",
      icon: <PowerSettingsNewIcon className="text-red-600" />,
    },
  ];

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  const handleSubmit = () => {
    removeCookies();
    localStorage.clear();
    router.push("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white !important",
        borderBottom: "0.5px solid lightgrey !important",
        boxShadow: "none !important",
        height: "66px !important",
        width: {
          sm: openSidebar ? `calc(100% - 200px)` : `calc(100% - 65px)`,
        },
        ml: { sm: openSidebar ? `200px` : `65px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="!text-[#000000]">
            <span className="!font-bold text-lg">
              {url.includes("setting")
                ? "Report Characteristics"
                : url.includes("audit")
                ? "TPA RecordKeeper Report Analyzer"
                : "Audit Document Tracking"}
            </span>
          </div>
          <div className="relative flex gap-[30px]">
            {/* <NotificationIcon /> */}

            {/* <div className="absolute bottom-3 left-7">
              <Badge color="primary" variant="dot" className="right-2"></Badge>
            </div> */}

            <div
              className="cursor-pointer relative flex gap-2.5 items-center"
              onClick={handleToggle}
            >
              <Avatar alt={name} src="" sx={{ width: 24, height: 24 }} />
              <span className="!text-[#000000] text-xs ">{name}</span>

              {isOpen ? <ArrowUp /> : <ArrowDown />}
              <div
                style={{
                  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
                  width: dropDownRef.current?.clientWidth,
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: 0,
                }}
                className={`absolute mt-[5px] bg-[#f9f9f9] z-10 ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <ul className="max-h-[400px] m-0 p-0 list-none border-b border-b-[#d8d8d8] overflow-auto">
                  {options.map((option) => (
                    <li
                      key={option.id}
                      className="mx-5 my-5 cursor-pointer flex items-center justify-between text-[14px] font-normal"
                      id={option.id.toString()}
                      value={option.label}
                      onClick={handleSubmit}
                    >
                      <span className="flex items-center gap-[10px]">
                        <span>{option.icon}</span>
                        <span className="truncate w-40 text-black text-sm">
                          {option.label}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
