import { useEffect, useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import ImgCrop from "antd-img-crop";
import { addReq } from "../../services/addRequest";
import { deleteReq } from "../../services/deleteRequest";
import { useShopStore } from "../../../store/useShopStore";

const ImageUpload = ({ imageStyle, fileUrl, setFileUrl, limit }) => {
  const { images, addImage, removeImage } = useShopStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePreview = () => {
    setPreviewImage(`${import.meta.env.VITE_SERVER_URL}${fileUrl}`);
    setPreviewOpen(true);
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await addReq(formData, "files/upload");
      const uploadedPath = data?.path; 
      if (uploadedPath) {
        addImage(uploadedPath);
        setFileUrl(uploadedPath);
      }
      onSuccess("ok");
    } catch (err) {
      onError(err);
    } finally {
      setUploading(false);
    }
  };
  const handleRemove = async () => {
    if (!fileUrl) return false;
    removeImage(fileUrl)
    const filename = fileUrl.split("/").pop();
    try {
      await deleteReq(filename, "files/delete");
      setFileUrl("");
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const beforeUnload = async (e) => {
      if (fileUrl) {
        e.preventDefault();
        e.returnValue = "Rasm hali saqlanmagan, o‘chirmoqchimisiz?";
        const confirmed = window.confirm(
          "Rasm hali saqlanmagan, o‘chirmoqchimisiz?"
        );
        if (confirmed) {
          const filename = fileUrl.split("/").pop();
          await deleteReq(filename, "files/delete");
        }
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [fileUrl]);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      type="button"
    >
      {uploading ? (
        <LoadingOutlined style={{ fontSize: 24 }} />
      ) : (
        <PlusOutlined />
      )}
      <div style={{ marginTop: 8 }}>
        {uploading ? "Yuklanmoqda..." : "Upload"}
      </div>
    </button>
  );

  return (
    <>
      <ImgCrop rotationSlider aspect={1} modalTitle="Rasmni yuklash" modalOk="Yuklash" modalCancel="Bekor qilish">
        <Upload
          listType={`picture-${imageStyle}`}
          fileUrl={fileUrl}
          onPreview={handlePreview}
          onRemove={handleRemove}
          customRequest={customUpload}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        >
          {fileUrl.length >= limit ? null : uploadButton}
        </Upload>
      </ImgCrop>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) =>
              !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;
