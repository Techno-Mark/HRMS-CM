interface GroupType {
  id: number;
  reportGroupTypes: string;
  active: boolean;
  activeId: number;
}

export const getURLDummyData = (groupTypes: GroupType[]) => {
  return groupTypes.map((groupType) => ({
    tableId: groupType.id,
    reportName: `TPA Request - ${groupType.reportGroupTypes}`,
    reportUrl: "",
  }));
};
