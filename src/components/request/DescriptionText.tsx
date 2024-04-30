import { Typography } from "@mui/material";
import { DescriptionTextProps } from "@/types/DescriptionText";

const DescriptionText = ({
  validated,
  planSponserName,
  name,
  email,
  isTPAAvailableInAnyRow,
}: DescriptionTextProps) => {
  return (
    <div className="px-4 mx-auto pt-4 pb-4">
      {validated ? (
        <Typography className="!text-[14px] !font-normal text-[#333] !font-poppins">
          We are the independent accountants for <b>{planSponserName}</b>. With
          permission from <b>{name}</b>&nbsp;({email})&nbsp;
          {isTPAAvailableInAnyRow
            ? "we request that you provide the listed reports conveniently named for you to readily recognize by dragging into the secure box for the respective reports."
            : "we request that you provide the listed reports by dragging into the secure box for the respective reports."}
          &nbsp;If the document is not yet available, please enter the Expected
          Date. We prefer that the last 4 digits of social security numbers be
          used for participant identification and birthday month and year only.
        </Typography>
      ) : (
        <Typography className="!text-[14px] !font-normal text-[#333] !font-poppins">
          Permission has been granted by your client{" "}
          <b>{!planSponserName ? "[Plan Name]" : planSponserName}</b> to send
          documents needed for Department of Labor audit requirements. Note that
          this system also tracks the document status for the convenience of all
          authorized users connected. Please log in with your e-mail and
          security code.
        </Typography>
      )}
    </div>
  );
};

export default DescriptionText;
