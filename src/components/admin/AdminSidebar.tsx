import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  List,
  Drawer,
  styled,
  Divider,
  ListItem,
  IconButton,
  CssBaseline,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Theme, makeStyles } from "@material-ui/core/styles";

import ArrowUp from "@/assets/icons/ArrowUp";
import Settings from "@/assets/icons/Settings";
import LinkIcon from "@mui/icons-material/Link";
import Documents from "@/assets/icons/Documents";
import ArrowDown from "@/assets/icons/ArrowDown";
import Dashboard from "@/assets/icons/Dashboard";
import ControlPanel from "@/assets/icons/ControlPanel";
import MenuIconOpen from "@/assets/icons/MenuIconOpen";
import MenuIconClose from "@/assets/icons/MenuIconClose";

import { SidebarProps } from "@/types/SideBar";
import { drawerWidth } from "@/static/commonVariables";
import { UploadFile } from "@mui/icons-material";

export const sidebarItems = [
  {
    module: "Documents",
    link: "/admin/documents",
    icon: <Documents />,
  },
  {
    module: "Manage Users",
    link: "/admin/manage-users",
    icon: <Dashboard />,
  },
  {
    module: "Control Panel",
    link: "/admin/controlpanel",
    icon: <ControlPanel />,
  },
  {
    module: "Setting",
    link: "#",
    icon: <Settings />,
    isOpen: true,
    subModule: [
      {
        module: "Manage Document",
        link: "/admin/manage-document",
        icon: <></>,
      },
    ],
  },
];

const useStyles = makeStyles({
  imageCenter: {
    justifyContent: "center",
    width: "100%",
  },
  textSize: {
    fontSize: "14px",
    fontFamily: "Poppins !important",
  },
  drawer: {
    background: "#223E99",
    height: `calc(100%)`,
  },
});

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const MyDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: any) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerFooter = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  position: "absolute",
  bottom: 0,
}));

const Sidebar = ({
  openSidebar,
  setOpenSidebar,
  onRouteChange,
}: SidebarProps) => {
  const classes = useStyles();
  const pathname = usePathname();
  const [isOpen, setIsopen] = useState<boolean>(
    pathname === "/admin/manage-document" ? true : false
  );

  return (
    <>
      <CssBaseline />
      <MyDrawer
        classes={{ paper: classes.drawer }}
        className="z-0"
        variant="permanent"
        open={openSidebar}
      >
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {openSidebar ? (
                <Image
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(100%) sepia(100%) hue-rotate(200deg)",
                  }}
                  alt="logo1"
                  src={"/BDG_Logo.png"}
                  width={50}
                  height={30}
                />
              ) : (
                <Image
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(100%) sepia(100%) hue-rotate(200deg)",
                  }}
                  alt="logo"
                  src={"/BDG_Logo.png"}
                  width={50}
                  height={30}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider className="bg-white" />
        {sidebarItems.map((item, index) => (
          <div key={index}>
            <List
              className={`flex items-center my-1 p-0 ${
                pathname === item.link ? "!border-l-4" : "transparent"
              }`}
            >
              <Link href={item.link} passHref key={item.module}>
                <ListItemButton
                  onClick={() => {
                    item.link === "#" ? setIsopen(!isOpen) : onRouteChange();
                  }}
                  className={`sidebar-custom ${
                    pathname === item.link ? "activeLabel" : "transparent"
                  }`}
                  sx={{
                    height: 40,
                    justifyContent: openSidebar ? "initial" : "center",
                    px: 1.5,
                    py: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openSidebar ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.textSize }}
                    primary={item.module}
                    sx={{
                      opacity: openSidebar ? 1 : 0,
                      color: "#ffffff",
                    }}
                  />
                  {!!item.subModule ? (
                    <div className="ml-1.5">
                      {isOpen ? <ArrowUp /> : <ArrowDown />}
                    </div>
                  ) : (
                    <></>
                  )}
                </ListItemButton>
              </Link>
            </List>

            {!!item.subModule &&
              isOpen &&
              item.subModule?.map((item, index) => (
                <List
                  key={index}
                  className={`my-1 p-0 ${
                    pathname === item.link ? "!border-l-4" : "transparent"
                  }`}
                >
                  <Link href={item.link} passHref key={item.module}>
                    <ListItemButton
                      onClick={() => {
                        onRouteChange();
                      }}
                      className={`flex justify-end sidebar-custom ${
                        pathname === item.link ? "activeLabel" : "transparent"
                      }`}
                      sx={{
                        height: 40,
                        justifyContent: openSidebar ? "initial" : "center",
                        px: 1.5,
                        py: 2,
                      }}
                    >
                      <ListItemText
                        classes={{ primary: classes.textSize }}
                        primary={item.module}
                        sx={{
                          opacity: openSidebar ? 1 : 0,
                          color: "#ffffff",
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </List>
              ))}
          </div>
        ))}
        <DrawerFooter>
          <Divider sx={{ mb: 1 }} />
          <IconButton onClick={() => setOpenSidebar(!openSidebar)}>
            {openSidebar ? <MenuIconOpen /> : <MenuIconClose />}
          </IconButton>
        </DrawerFooter>
      </MyDrawer>
    </>
  );
};

export default Sidebar;
