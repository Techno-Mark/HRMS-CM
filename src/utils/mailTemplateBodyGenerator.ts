export const mailTemplateBodyGenerator = (arg1: string[]) => {
  return `<table style=\"border-collapse:collapse;margin:0;padding:0\"><tbody>${arg1
    .map(
      (a: string) =>
        `<tr><td>${a.replace(
          "<p>",
          '<p style="margin:0;padding:0;display:inline">'
        )}</td></tr>`
    )
    .join("")}</tbody></table>`;
};
