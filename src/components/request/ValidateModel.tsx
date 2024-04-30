import { ChangeEvent, useState } from "react";
import { Button, DialogContent, DialogActions, TextField } from "@mui/material";
import {
  callAPIwithHeadersForRequest,
  callAPIwithoutHeaders,
} from "@/api/commonAPI";

interface FieldsType {
  email: string;
  accessPIN: string;
}

interface ValidateModelPropsType {
  email: string;
  pin: string;
  isLoaded: (arg1: boolean) => void;
  verifyToken: (arg1: string) => void;
}

const initialState = {
  email: "",
  accessPIN: "",
};

const ValidateModel = ({
  email,
  pin,
  verifyToken,
  isLoaded,
}: ValidateModelPropsType) => {
  const [errorMsg, setErrorMsg] = useState<FieldsType>(initialState);
  const [validationFields, setValidationFields] = useState<FieldsType>({
    ...initialState,
    email: email,
    accessPIN: pin,
  });

  const handleValidationFieldsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(initialState);
    // if (
    //   e.target.name === "accessPIN" &&
    //   (!/(^[a-zA-Z0-9]+$|^$)/.test(e.target.value) || e.target.value.length > 6)
    // ) {
    //   return;
    // }

    setValidationFields({
      ...validationFields,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    const { email, accessPIN } = validationFields;

    if (!email && !accessPIN) {
      setErrorMsg({
        email: "Email is required",
        accessPIN: "Security code is required",
      });
      return false;
    }
    if (!email) {
      setErrorMsg({
        ...errorMsg,
        email: "Email is required!",
      });
      return false;
    }
    if (!accessPIN) {
      setErrorMsg({
        ...errorMsg,
        accessPIN: "Security code is required!",
      });
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setErrorMsg({
        ...errorMsg,
        email: "Email is not valid!",
      });
      return false;
    }
    if (accessPIN.length < 6) {
      setErrorMsg({
        ...errorMsg,
        accessPIN: "Please enter 6 digit valid code!",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="w-1/2 flex flex-col m-auto">
      <DialogContent>
        <TextField
          className="!my-2 w-full"
          name="accessPIN"
          label="Security Code"
          error={!!errorMsg.accessPIN}
          helperText={errorMsg.accessPIN}
          value={validationFields.accessPIN}
          onChange={handleValidationFieldsChange}
        />
      </DialogContent>
      <DialogActions className="w-[98%]">
        <Button
          onClick={() => verifyToken(validationFields.accessPIN)}
          // onClick={() => {
          //   if (validateInputs()) {
          //     isLoaded(false);
          //     verifyToken(validationFields.email, validationFields.accessPIN);
          //   }
          // }}
        >
          Login
        </Button>
      </DialogActions>
    </div>
  );
};

export default ValidateModel;
