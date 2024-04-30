import { AppBarProps as MuiAppBarProps } from "@mui/material";

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export interface Option {
  id: number;
  label: string;
  icon: React.ReactElement;
}

export interface HeaderPropsType {
  openSidebar: boolean;
}
