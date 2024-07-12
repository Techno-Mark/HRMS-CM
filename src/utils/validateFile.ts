const allowedExtensions = [
  "pdf",
  "jpeg",
  "jpg", "png"
];

export const validateFile = (file: File, type: number) => {
  if (type === 1) {
    const fileType = `${file.name}`;
    const fileTypeParts = fileType.split(".");
    const fileTypeExtension = fileTypeParts[fileTypeParts.length - 1];
    return allowedExtensions.includes(fileTypeExtension.toLowerCase());
  }
  if (type === 2) {
    const fileSizeInMB = Math.round(file.size / 1024 / 1024);
    return fileSizeInMB > 100;
  }
  return true;
};
