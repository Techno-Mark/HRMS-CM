import ExportIcon from "@/assets/icons/ExportIcon";
import { callAPIwithHeaders } from "@/api/commonAPI";
import { ExportPropsType } from "@/types/Export";

const Export = ({
  tpaCompanyMasterId,
  planEnagagementId,
  reportGroupId,
  activeGroupId,
}: ExportPropsType) => {
  const exportAdminReports = async () => {
    const callBack = (
      status: boolean,
      message: string,
      data: any,
      headers: any
    ) => {
      if (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Report.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    };
    callAPIwithHeaders(
      "/ControlPanel/ExportReports",
      "post",
      callBack,
      {
        tpaCompanyMasterId: tpaCompanyMasterId,
        planEnagagementId: planEnagagementId,
        reportGroupId: reportGroupId,
      },
      {
        responseType: "arraybuffer",
      }
    );
  };

  return (
    <div
      className={`flex gap-2 items-center text-sm font-medium capitalize ${
        tpaCompanyMasterId === null ||
        planEnagagementId === null ||
        activeGroupId === 9
          ? "pointer-events-none opacity-50"
          : "cursor-pointer"
      }`}
      onClick={
        tpaCompanyMasterId === null ||
        planEnagagementId === null ||
        activeGroupId === 9
          ? undefined
          : exportAdminReports
      }
    >
      <ExportIcon />
      Export
    </div>
  );
};

export default Export;
