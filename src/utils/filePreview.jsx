import { Button } from "reactstrap";

export const renderFilePreview = (file, width = 80) => {
  console.log(file);
  if (!file) return null;

  let fileUrl = "";
  let fileType = "";

  // 👉 If file is object (new upload)
  if (typeof file === "object") {
    fileUrl = URL.createObjectURL(file);
    fileType = file.type;
  } else {
    // 👉 If string (existing file from server)
    fileUrl = file;
    const ext = file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      fileType = "image";
    } else if (ext === "pdf") {
      fileType = "application/pdf";
    } else {
      fileType = "other";
    }
  }

  // 👉 Image Preview
  if (fileType.startsWith("image") || fileType === "image") {
    return (
      <img
        src={fileUrl}
        alt="preview"
        style={{
          width,
          height: "auto",
          marginTop: 5,
          borderRadius: 5,
          border: "1px solid #ddd"
        }}
      />
    );
  }

  // 👉 Other files (PDF etc.)
  return (
    <div style={{ marginTop: 5 }}>
      <Button
        size="sm"
        color="info"
        onClick={() => window.open(fileUrl, "_blank")}
      >
        Preview File
      </Button>
    </div>
  );
};
