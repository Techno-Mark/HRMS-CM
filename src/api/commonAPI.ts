import axios from "axios";
import { toast } from "react-toastify";
import { getToken, removeCookies } from "@/utils/authFunctions";

interface SearchParamsType {
  name: string;
  value: string;
}

export const callAPIwithoutHeaders = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    status: boolean,
    message: string,
    data: any,
    headers: any
  ) => void,
  params: Object
) => {
  let response;
  const url = new URL(process.env.apidev_url!);
  url.pathname = pathName;

  try {
    if (method === "get") {
      response = await axios.get(url.toString());
    } else if (method === "post") {
      response = await axios.post(url.toString(), params);
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { status, data, message } = response.data;
    successCallback(status, message, data, response.headers);
  } catch (error: any) {
    successCallback(
      false,
      `Something went wrong, please refer console for more details.`,
      undefined,
      undefined
    );
    console.error(error.message);
  }
};

export const callAPIwithHeadersForRequest = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    status: boolean,
    message: string,
    data: any,
    headers: any
  ) => void,
  params: Object,
  headerIfAny?: any
) => {
  let response;
  const url = new URL(process.env.apidev_url!);
  url.pathname = pathName;

  try {
    if (method === "get") {
      response = await axios.get(url.toString(), {
        headers: { ...headerIfAny },
      });
    } else if (method === "post") {
      response = await axios.post(url.toString(), params, {
        headers: { ...headerIfAny },
      });
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { status, data, message } = response.data;
    successCallback(status, message, data, response.headers);
  } catch (error: any) {
    if (!!error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request, please check your payload.");
          return;
        case 401:
          toast.error("Invalid or Expired Token.");
          window.location.reload();
          return;
      }
    }

    successCallback(
      false,
      `Something went wrong, please refer console for more details.`,
      undefined,
      undefined
    );
    console.error(error.message);
  }
};

export const callAPIwithHeaders = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    status: boolean,
    message: string,
    data: any,
    headers: any
  ) => void,
  params: Object,
  headerIfAny?: any
) => {
  let response;
  const url = new URL(process.env.apidev_url!);
  url.pathname = pathName;

  try {
    if (method === "get") {
      response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          ...headerIfAny,
        },
      });
    } else if (method === "post") {
      response = await axios.post(url.toString(), params, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          ...headerIfAny,
        },
      });
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { status, data, message } = response.data;

    if (pathName === "/Document/DownloadFileInBulk") {
      successCallback(true, "success", response.data, response.headers);
      return
    }

    successCallback(status, message, data, response.headers);
  } catch (error: any) {
    if (!!error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request, please check your payload.");
          return;
        case 401:
          toast.error("Invalid or Expired Token.");
          removeCookies();
          window.location.href = "/";
          return;
      }
    }

    successCallback(
      false,
      `Something went wrong, please refer console for more details.`,
      undefined,
      undefined
    );
    console.error(error.message);
  }
};

export const callAPIwithParams = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    status: boolean,
    message: string,
    data: any,
    headers: any
  ) => void,
  params: Object,
  searchParams?: SearchParamsType,
) => {
  let response;
  const url = new URL(process.env.apidev_url!);
  url.pathname = pathName;

  if (!!searchParams && !!searchParams.name) {
    url.searchParams.set(searchParams.name, searchParams.value);
  }

  try {
    if (method === "get") {
      response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } else if (method === "post") {
      response = await axios.post(url.toString(), params, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { status, data, message } = response.data;

    if (pathName === "/Document/DownloadFile") {
      successCallback(true, "success", response.data, response.headers);
      return
    }
    successCallback(status, message, data, response.headers);
  } catch (error: any) {
    if (!!error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request, please check your payload.");
          return;
        case 401:
          toast.error("Invalid or Expired Token.");
          removeCookies();
          window.location.href = "/";
          return;
      }
    }

    successCallback(
      false,
      `Something went wrong, please refer console for more details.`,
      undefined,
      undefined
    );
    console.error(error);
  }
};

export const callAPIwithParamswithoutToken = async (
  pathName: string,
  method: "get" | "post",
  successCallback: (
    status: boolean,
    message: string,
    data: any,
    headers: any
  ) => void,
  params: Object,
  searchParams?: SearchParamsType,
) => {
  let response;
  const url = new URL(process.env.apidev_url!);
  url.pathname = pathName;

  if (!!searchParams && !!searchParams.name) {
    url.searchParams.set(searchParams.name, searchParams.value);
  }

  try {
    if (method === "get") {
      response = await axios.get(url.toString());
    } else if (method === "post") {
      response = await axios.post(url.toString(), params);
    } else {
      throw new Error(
        "Unsupported HTTP method. Only GET and POST are supported."
      );
    }

    const { status, data, message } = response.data;

    if (pathName === "/Document/DownloadFile") {


      successCallback(true, "success", response.data, response.headers);
      return
    }
    successCallback(status, message, data, response.headers);
  } catch (error: any) {
    if (!!error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad Request, please check your payload.");
          return;
        case 401:
          toast.error("Invalid or Expired Token.");
          removeCookies();
          window.location.href = "/";
          return;
      }
    }

    successCallback(
      false,
      `Something went wrong, please refer console for more details.`,
      undefined,
      undefined
    );
    console.error(error);
  }
};
