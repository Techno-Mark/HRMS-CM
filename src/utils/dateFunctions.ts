import dayjs from "dayjs";

export const checkIfDateIsValid = (e: any) => {
  const today = new Date();

  const isNotPastDate =
    e !== null
      ? parseInt(e.$y) > today.getFullYear()
        ? true
        : parseInt(e.$y) === today.getFullYear() &&
          parseInt(e.$M) > today.getMonth()
        ? true
        : parseInt(e.$y) === today.getFullYear() &&
          parseInt(e.$M) === today.getMonth() &&
          parseInt(e.$D) >= today.getDate()
        ? true
        : false
      : false;

  return isNotPastDate;
};

export const dateFormatSetter = (e: any) => {
  const fullDate = dayjs(e).format("MM/DD/YYYY");

  const dateSplits = fullDate.split("/");
  const year = dateSplits[2];
  const month = dateSplits[0];
  const date = dateSplits[1];

  return `${year}-${month}-${date}T00:00:00`;
};
