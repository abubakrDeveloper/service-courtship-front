import { useEffect, useState } from "react";
import { PlusOutlined, LoadingOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Upload, Image, message } from "antd";
import ImgCrop from "antd-img-crop";
import { addReq } from "../../services/addRequest";
import { deleteReq } from "../../services/deleteRequest";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { useProductStore } from "../../store/useProductStore";

const ImageUpload = ({ imageStyle = "card", fileUrl, setFileUrl, limit = 1, source }) => {
  const { images, addImage, removeImage, itemList } =  source === "employee" ? useEmployeeStore() : useProductStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePreview = () => {
    if (!fileUrl) return;
    setPreviewImage(`${import.meta.env.VITE_SERVER_URL}${fileUrl}`);
    setPreviewOpen(true);
  };

  // ✅ Yuklash
  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await addReq(formData, "files/upload");
      const uploadedPath = data?.path;

      if (uploadedPath) {
        addImage(uploadedPath); // 🔥 store ga saqlaymiz
        setFileUrl(uploadedPath);
        message.success("Rasm muvaffaqiyatli yuklandi!");
      }

      onSuccess("ok");
    } catch (err) {
      message.error("Rasm yuklashda xatolik!");
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
  if (fileUrl && !images.includes(fileUrl)) {
    addImage(fileUrl);
  }
}, [fileUrl]);

  const handleRemove = async () => {
    if (!fileUrl) return false;

    // ✅ Agar bu rasm itemList ichida ishlatilayotgan bo‘lsa, o‘chirib bo‘lmaydi
    const usedInList = itemList.some(p => p.image === fileUrl);
    if (usedInList) {
      message.warning("Bu rasm tavar ro‘yxatida ishlatilayapti!");
      return false;
    }

    const filename = fileUrl.split("/").pop();
    try {
      await deleteReq(filename, "files/delete");
      removeImage(fileUrl);
      setFileUrl("");
      message.success("Rasm o‘chirildi");
      return true;
    } catch (err) {
      message.error("Rasmni o‘chirishda xatolik!");
      return false;
    }
  };
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
      {uploading ? <LoadingOutlined style={{ fontSize: 24 }} /> : <CloudUploadOutlined style={{ fontSize: 24 }}/>}
      <div style={{ marginTop: 8 }}>
        {uploading ? "Yuklanmoqda..." : "Rasm tanlash"}
      </div>
    </button>
  );

  return (
    <>
      <ImgCrop rotationSlider aspect={1} modalTitle="Rasmni yuklash" modalOk="Yuklash" modalCancel="Bekor qilish">
        <Upload
          listType={`picture-${imageStyle}`}
          fileList={
            fileUrl
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: `${import.meta.env.VITE_SERVER_URL}${fileUrl}`,
                  },
                ]
              : []
          }
          customRequest={customUpload}
          onPreview={handlePreview}
          onRemove={handleRemove}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        >
          {fileUrl ? null : uploadButton}
        </Upload>
      </ImgCrop>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;
