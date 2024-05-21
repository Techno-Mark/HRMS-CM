"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { callAPIwithoutHeaders } from "../api/commonAPI";
import { initialFieldStringValues } from "@/static/commonVariables";
import { StringFieldType } from "@/types/Login";
import Loader from "@/components/common/Loader";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<StringFieldType>(initialFieldStringValues);
  const [password, setPassword] = useState<StringFieldType>(
    initialFieldStringValues
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (email.error || password.error) {
      setLoading(false);
      return;
    }
    if (email.value.trim().length === 0) {
      setEmail({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }
    if (password.value.trim().length === 0) {
      setPassword({ ...initialFieldStringValues, error: true });
      setLoading(false);
      return;
    }

    const callBack = (status: boolean, message: string, data: any) => {
      console.log(status, message);

      if (status) {
        if (!data.token) {
          toast.error("User or token is undefined!");
          router.push("/");
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }
        setIsLoggedIn(true);
        setLoading(false);
        console.log(data);

        Cookies.set(
          "userInfo",
          JSON.stringify({ firstName: data.firstName, lastName: data.lastName })
        );
        Cookies.set("token", JSON.stringify(data.token));
        router.push("/admin/controlpanel");
        setLoading(true);
      } else {
        setIsLoggedIn(false);
        setLoading(false);
        toast.error(message);
      }
    };

    callAPIwithoutHeaders("/User/Login", "post", callBack, {
      email: email.value,
      password: password.value,
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

  useEffect(() => {
    if (!Cookies.get("userInfo")) {
      router.push("/");
    } else {
      router.push("/admin/controlpanel");
    }
  }, []);

  if (loading)
    return (
      <Loader
        descriptionText={
          isLoggedIn ? "Redirecting to control panel" : undefined
        }
      />
    );
  if (!loading)
    return (
      <div className="flex flex-col justify-center min-h-screen relative">
        <div className="flex items-center justify-between max-h-screen min-w-full relative">
          <Image
            src="https://staging-tms.azurewebsites.net/assets/images/pages/login-v2.svg"
            alt="Login"
            className="w-[50%]"
            width={500}
            height={500}
          />
          <span className="absolute top-4 left-16">
            <Image
              alt="logo1"
              src={"/full_image.png"}
              width={200}
              height={50}
            />
          </span>
          <div className="loginWrapper flex items-center flex-col pt-[10%] !w-[40%] font-normal border-l border-lightSilver">
            <p className="font-bold mb-[20px] text-darkCharcoal text-2xl">
              Welcome to HRMS-DMS
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
              <div>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-[300px] lg:w-[356px] !mb-2"
                  id="outlined-basic"
                  required
                  value={password.value}
                  error={password.error}
                  helperText={password.error && password.errorText}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  label="Password"
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
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-[4px] w-[300px] lg:w-[356px] !h-[36px] !bg-[#223E99] !mt-2 float-right"
                  // onClick={handleSubmit}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Page;
