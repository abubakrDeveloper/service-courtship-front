import { Drawer, Descriptions, Image, Divider, Tag, Avatar, message } from "antd";
import { ShopOutlined, CopyOutlined } from "@ant-design/icons";

const PreviewDrawer = ({ open, onClose, preview }) => {
  if (!preview) return null;

  // Copy funksiyasi
  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label} nusxalandi!`);
    } catch (err) {
      message.error("Nusxalashda xatolik yuz berdi!");
    }
  };

  const copyableItem = (label, value) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{height: "25px", overflowY: "hidden"}}>{value}</span>
      <CopyOutlined
        onClick={() => handleCopy(value, label)}
        style={{
          cursor: "pointer",
          color: "#1890ff",
          marginLeft: 8,
        }}
      />
    </div>
  );

  return (
    <Drawer
      title={`Tavar haqida ma'lumot`}
      width={550}
      onClose={onClose}
      open={open}
      bodyStyle={{ padding: 0 }}
    >
      {/* Tavar rasmi */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {preview?.image ? (
          <Image
            src={`${import.meta.env.VITE_SERVER_URL}${preview.image}`}
            alt={preview.productName}
            width={200}
            height={190}
            style={{
              objectFit: "contain",
              borderRadius: 10,
              background: "#f5f5f5",
              padding: 10,
            }}
          />
        ) : (
          <Avatar
            size={200}
            style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
            shape="square"
            icon={<ShopOutlined />}
          />
        )}
      </div>

      <Divider />

      {/* Tavar tafsilotlari */}
      <Descriptions column={1} bordered size="middle" style={{ label: {width: 160}}}>
        {preview.id && <Descriptions.Item label="Tavar ID">
          {copyableItem("Firma ID", preview.id)}
        </Descriptions.Item>}
        {preview.productName && <Descriptions.Item label="Tavar nomi">
          {copyableItem("Tavar nomi", preview.productName)}
        </Descriptions.Item>}

        {preview.count && <Descriptions.Item label="Soni">{preview.count}</Descriptions.Item>}

        {preview.takingPrice && <Descriptions.Item label="Olish narxi">
          {Number(preview.takingPrice).toLocaleString()} {preview.valyuta}
        </Descriptions.Item>}

        {preview.sellingPrice && <Descriptions.Item label="Sotish narxi">
          {Number(preview.sellingPrice).toLocaleString()} {preview.valyuta}
        </Descriptions.Item>}

        {preview.promotion && <Descriptions.Item label="Chegirma">
          {preview.promotion}%
        </Descriptions.Item>}

        {preview.sellingPercentage && <Descriptions.Item label="Foyda foizi">
          {preview.sellingPercentage}%
        </Descriptions.Item>}

        {preview.valyuta && <Descriptions.Item label="Valyuta">
          <Tag color="blue">{preview.valyuta}</Tag>
        </Descriptions.Item>}

        {preview.firmId && <Descriptions.Item label="Firma ID">
          {copyableItem("Firma ID", preview.firmId)}
        </Descriptions.Item>}

        {preview.filialId && <Descriptions.Item label="Filial ID">
          {copyableItem("Filial ID", preview.filialId)}
        </Descriptions.Item>}

        {preview.categoryId && <Descriptions.Item label="Kategoriya ID">
          {copyableItem("Kategoriya ID", preview.categoryId)}
        </Descriptions.Item>}

        {preview.Qrcode && <Descriptions.Item label="QR Code">
          {copyableItem("QR Code", preview.Qrcode)}
        </Descriptions.Item>}

        {preview.date && (
          <Descriptions.Item label="Qo‘shilgan sana">
            {new Date(preview.date).toLocaleDateString("uz-UZ")}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default PreviewDrawer;
