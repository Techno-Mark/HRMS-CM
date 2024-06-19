import { ReactNode, useEffect, useState } from "react";
//mui components
import { Box, CssBaseline, Toolbar } from "@mui/material";
//custom components
import Header from "./admin/AdminHeader";
import Sidebar from "./admin/AdminSidebar";
import { drawerWidth } from "@/static/commonVariables";
import { useRouter } from "next/navigation";
import Loader from "./common/Loader";
import Cookies from "js-cookie";

type WrapperPropsType = {
  isScrollable?: boolean;
  children: ReactNode;
};

const Wrapper = ({ isScrollable, children }: WrapperPropsType) => {
  const router = useRouter();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!Cookies.get("userInfo")) {
      setAuthenticated(false);
      router.push("/");
    } else {
      setAuthenticated(true);
    }
  }, []);

  const startLoading = () => {
    setLoading(true);

    setTimeout(() => setLoading(false), 5000);
  };

  if (!authenticated) return <Loader />;
  if (loading) return <Loader />;
  if (authenticated)
    return (
      <>
        <div className="max-h-screen flex flex-col overflow-hidden">
          <Box
            sx={{
              height: `calc(100vh - 36px)`,
              display: "flex",
              overflow: isScrollable ? "scroll" : "hidden",
            }}
          >
            <CssBaseline />
            <Header openSidebar={openSidebar} />
            <Sidebar
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
              onRouteChange={startLoading}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pt: 2,
                px: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Toolbar />
              {children}
            </Box>
          </Box>
        </div>
      </>
    );
};

export default Wrapper;
