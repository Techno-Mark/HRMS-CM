import "./Loader.css";
import { CircularProgress } from "@mui/material";

interface LoaderPropsType {
  descriptionText?: string;
}

const Loader = ({ descriptionText }: LoaderPropsType) => {
  return (
    <div className="h-screen w-full fixed top-0 bottom-0 left-0 right-0 z-[9999] bg-[#0000004d] flex flex-col gap-4 items-center justify-center cursor-progress">
      <CircularProgress color="inherit" />
      {!!descriptionText && (
        <div className="w-fit flex items-end">
          <span className="text-lg">{descriptionText}</span>
          <span className="loader -ml-5 mb-1"></span>
        </div>
      )}
    </div>
  );
};

export default Loader;
