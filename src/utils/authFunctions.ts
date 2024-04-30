import Cookies from "js-cookie";

export const getToken = () => {
    return JSON.parse(Cookies.get("token")!);
};

export const removeCookies = () => {
    Cookies.remove("userInfo");
    Cookies.remove("token");
};
