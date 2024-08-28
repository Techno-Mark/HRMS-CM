"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
// import { callAPIwithoutHeaders } from "../api/commonAPI";
import { initialFieldStringValues } from "@/static/commonVariables";
import { StringFieldType } from "@/types/Login";
import Loader from "@/components/common/Loader";
import Cookies from "js-cookie";
import { callAPIwithHeaders, callAPIwithoutHeaders } from "@/api/commonAPI";
import Wrapper from "@/components/Wrapper";

const Page = () => {
  let userInfo;
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkID = searchParams.get("id");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCNFPassword, setShowCNFPassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState<StringFieldType>(
    initialFieldStringValues
  );
  const [password, setPassword] = useState<StringFieldType>(
    initialFieldStringValues
  );
  const [cnfpassword, setCNFPassword] = useState<StringFieldType>(
    initialFieldStringValues
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    if (Cookies.get("userInfo")) {
      userInfo = JSON.parse(Cookies.get("userInfo") ?? "");
    } else {
      toast.error("Invalid User or Email");
      router.push("/");
      return;
    }
    e.preventDefault();
    setLoading(true);
    if (password.error || currentPwd.error || cnfpassword.error) {
      setLoading(false);
      return;
    }
    if (currentPwd.value.trim().length === 0) {
      setCurrentPwd({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }
    if (password.value.trim().length === 0) {
      setPassword({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }
    if (cnfpassword.value.trim().length === 0) {
      setCNFPassword({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }
    if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/.test(
        password.value
      )
    ) {
      setPassword((prevPwd) => ({
        ...prevPwd,
        errorText: "Password is not valid",
        error: true,
      }));
      setLoading(false);
      return;
    }
    if (password.value !== cnfpassword.value) {
      setCNFPassword((prevPwd) => ({
        ...prevPwd,
        errorText: "Passwords doesn't match",
        error: true,
      }));
      setLoading(false);
      return;
    }

    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        toast.success(message);
        resetFields();
        router.push("/admin/controlpanel");
        setLoading(false);
      } else {
        toast.error(message);
        resetFields();
        setLoading(false);
      }
    };

    callAPIwithHeaders("/User/ChangePassword", "post", callBack, {
      email: userInfo.email,
      CurrentPassword: currentPwd.value,
      password: password.value,
      resetLink: linkID,
      isLoggedIn: true,
    });
  };

  const resetFields = () => {
    setCurrentPwd(initialFieldStringValues);
    setPassword(initialFieldStringValues);
    setCNFPassword(initialFieldStringValues);
  };

  const handlePasswordChange = (e: string) => {
    if (e.trim().length === 0) {
      setPassword({
        ...initialFieldStringValues,
        value: e,
        error: true,
      });
    } else {
      setPassword({
        ...initialFieldStringValues,
        value: e,
      });
    }
  };

  const handleCNFPasswordChange = (e: string) => {
    if (e.trim().length === 0) {
      setCNFPassword({
        ...initialFieldStringValues,
        value: e,
        error: true,
      });
    } else {
      setCNFPassword({
        ...initialFieldStringValues,
        value: e,
      });
    }
  };

  if (loading) return <Loader />;
  if (!loading)
    return (
      <Wrapper>
        <div className="mt-10 flex flex-col items-center">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2 mb-4">
              <div>
                <TextField
                  name="password"
                  type="password"
                  className="w-[356px] lg:w-[356px] !mb-2"
                  id="outlined-basic"
                  value={currentPwd.value}
                  error={currentPwd.error}
                  helperText={currentPwd.error && currentPwd.errorText}
                  onChange={(e) =>
                    setCurrentPwd({
                      ...initialFieldStringValues,
                      value: e.target.value,
                    })
                  }
                  label="Current Password*"
                  variant="outlined"
                />
              </div>
              <div>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-[300px] lg:w-[356px] !mb-2"
                  id="outlined-basic"
                  value={password.value}
                  error={password.error}
                  helperText={password.error && password.errorText}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  label="New Password*"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {!showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>
                <TextField
                  name="password"
                  type={showCNFPassword ? "text" : "password"}
                  className="w-[300px] lg:w-[356px] !mb-2"
                  id="outlined-basic"
                  value={cnfpassword.value}
                  error={cnfpassword.error}
                  helperText={cnfpassword.error && cnfpassword.errorText}
                  onChange={(e) => handleCNFPasswordChange(e.target.value)}
                  label="Re-enter Password*"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCNFPassword(!showCNFPassword)}
                        >
                          {!showCNFPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                className="rounded-[4px] w-[300px] lg:w-[356px] !h-[36px] !bg-[#223E99] !mt-2 float-right"
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </Wrapper>
    );
};

export default Page;
