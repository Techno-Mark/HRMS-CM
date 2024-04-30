import { Box } from "@mui/material";
import styled from "styled-components";
import NoReports from "@/assets/icons/NoReports";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
}));

interface CustomNoRowsOverlayProps {
  descriptionText: string;
}

const CustomNoRowsOverlay = ({
  descriptionText = "There are no reports or documents found for the criteria selected.",
}: CustomNoRowsOverlayProps) => {
  return (
    <StyledGridOverlay>
      <NoReports />
      <Box sx={{ mt: 1 }}>{descriptionText}</Box>
    </StyledGridOverlay>
  );
};

export default CustomNoRowsOverlay;
