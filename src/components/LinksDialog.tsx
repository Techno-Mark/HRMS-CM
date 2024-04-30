import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import styled from "styled-components";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import { toastOptions } from "@/static/toastOptions";
import { toast } from "react-toastify";
import { LinksDialogProps, LinksType } from "@/types/LinksDialog";

const LinksDialog = ({ links, handleClose }: LinksDialogProps) => {
  const url = new URL("http://localhost:3000/");
  return (
    <Dialog
      open={links.length > 0}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <div className="flex flex-row justify-between items-center gap-20">
          <span>Links Generated</span>
          <CustomToolTip title="Close" placement="top" arrow>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </CustomToolTip>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="w-full">
          <div className="flex !flex-col">
            {links.map((link: any) => {
              // url.pathname = "/request";
              // url.searchParams.set("id", link.guid);
              return (
                <span className="flex !items-center !justify-center" key={link}>
                  <Button
                    variant="contained"
                    className="flex !items-center !justify-center !rounded-r-sm !my-2 !h-[36px] !w-[75%] !bg-[#223E99] !text-[10px]"
                    onClick={async () => {
                      navigator.clipboard.writeText(link);
                      toast.success(
                        `Validate Code copied sucessfully`,
                        toastOptions
                      );
                    }}
                  >
                    {/* {link.reportGroup}&nbsp;Reports */}
                    Copy Validate Code
                  </Button>
                  <span className="flex !items-center !justify-center !h-[36px] !w-[15%] !inset-y-0 !bg-gray-200 !rounded-r-sm">
                    <LinkIcon className="text-[#223E99]" />
                  </span>
                </span>
              );
            })}
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default LinksDialog;

const CustomToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#223E99",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#223E99",
  },
}));
