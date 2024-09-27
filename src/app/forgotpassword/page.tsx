"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
// import { callAPIwithoutHeaders } from "../api/commonAPI";
import { initialFieldStringValues } from "@/static/commonVariables";
import { StringFieldType } from "@/types/Login";
import Loader from "@/components/common/Loader";
import Cookies from "js-cookie";
import { callAPIwithoutHeaders } from "@/api/commonAPI";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<StringFieldType>(initialFieldStringValues);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (email.error) {
      setLoading(false);
      return;
    }
    if (email.value.trim().length === 0) {
      setEmail({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }

    const callBack = (status: boolean, message: string, data: any) => {
      if (status) {
        toast.success(message);
        router.push("/");
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(message);
      }
    };

    callAPIwithoutHeaders("/User/ForgetPassword", "post", callBack, {
      email: email.value,
    });
  };

  const handleEmailChange = (e: { target: { value: string } }) => {
    if (e.target.value.trim().length === 0) {
      setEmail({
        ...initialFieldStringValues,
        value: e.target.value,
        error: true,
      });
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value.trim())
    ) {
      setEmail({
        value: e.target.value,
        error: true,
        errorText: "Email is not valid!",
      });
    } else {
      setEmail({
        ...initialFieldStringValues,
        value: e.target.value,
      });
    }
  };

  if (loading) return <Loader />;
  if (!loading)
    return (
      <div className="flex flex-col justify-center min-h-screen relative">
        <div className="flex items-center justify-between max-h-screen min-w-full relative">
          <Image
            src="/login-v2.svg"
            alt="Login"
            className="w-[50%]"
            width={500}
            height={500}
          />
          <span className="absolute top-4 left-16">
            <Image
              alt="logo1"
              src={"/final_full_image_blue.png"}
              width={200}
              height={50}
            />
          </span>
          <div className="loginWrapper flex items-center flex-col pt-[10%] !w-[40%] font-normal border-l border-lightSilver">
            <p className="font-bold mb-[20px] text-darkCharcoal text-2xl">
              Forgot Password
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center"
            >
              <div className="m-4">
                <TextField
                  name="email"
                  className="w-[300px] !mt-2 !mb-2 lg:w-[356px]"
                  id="outlined-basic"
                  label="Email-ID"
                  variant="outlined"
                  required
                  value={email.value}
                  error={email.error}
                  helperText={email.error && email.errorText}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-1">
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-[4px] w-[300px] lg:w-[356px] !h-[36px] !bg-[#223E99] !mt-2 float-right"
                >
                  Submit
                </Button>
              </div>
              <div>
                <Button
                  variant="outlined"
                  className="rounded-[4px] w-[300px] lg:w-[356px] !h-[36px] !mt-2 float-right"
                  onClick={() => {
                    setLoading(true);
                    router.push("/");
                  }}
                >
                  <ArrowBackIosNewOutlinedIcon className="mr-2 text-[#1976d296] !text-sm" />
                  Back to Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Page;
