import { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getReq } from "../../services/getRequeset";
import axios from "axios";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import ImageUpload from "../../components/UI/ImageUpload";
import { updateReq } from "../../services/putRequest";
import { addReq } from "../../services/addRequest";
import { useInfoContext } from "../../context/infoContext";

const CreateProduct = () => {
  const {removeTab, success, error} = useInfoContext()
  const [form] = Form.useForm();
  const { id } = useParams(); // agar id bo‘lsa → update rejim
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Mahsulotni olish (update rejimi uchun)
  const fetchProduct = async () => {
    try {
      const res = await getReq(`products/${id}`);
      const product = res.data;

      form.setFieldsValue({
        productName: product.productName,
        count: product.count,
        takingPrice: product.takingPrice,
        sellingPrice: product.sellingPrice,
        promotion: product.promotion,
        sellingPercentage: product.sellingPercentage,
        filialId: product.filialId,
        firmId: product.firmId,
        categoryId: product.categoryId,
        valyuta: product.valyuta || "UZS",
        image: product.image,
        Qrcode: product.Qrcode,
      });
    } catch (err) {
      message.error("Mahsulotni olishda xatolik!");
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    } else {
      form.setFieldsValue({ valyuta: "UZS" });
    }
  }, [id]);

  // 🔹 Submit
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        productName: values.productName || values.name, // nom moslash
        count: Number(values.count),
        takingPrice: Number(values.takingPrice || values.buyPrice),
        sellingPrice: Number(values.sellingPrice),
        promotion: Number(values.promotion) || 0,
        sellingPercentage: Number(values.sellingPercentage) || 0,
        filialId: values.filialId,
        valyuta: values.valyuta || "UZS",
        image: fileUrl || "", // /uploads/...jpg
        firmId: values.firmId,
        categoryId: values.categoryId,
        Qrcode: values.Qrcode || "",
      };

      console.log("Yuborilayotgan payload:", payload);

      if (id) {
        const res = await updateReq(id, payload, "products");
        console.log(res);
        
        success("Mahsulot yangilandi!");
      } else {
        const res = await addReq(payload, "products");
        console.log(res);
        
        success("Mahsulot qo‘shildi!");
      }

      removeTab('/products/new')
    } catch (err) {
      console.error("❌ Xatolik:", err.response?.data || err);
      error("Saqlashda xatolik!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="md:flex gap-6 items-start"
    >
      {/* Chapda — Rasm yuklash */}
      <div className="flex justify-center items-center w-full md:w-1/3">
        <Form.Item label="Mahsulot rasmi" className="text-center" name="image">
          <ImageUpload
            imageStyle="card"
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            limit={1}
          />
        </Form.Item>
      </div>

      {/* O‘ngda — Ma’lumotlar */}
      <div className="w-full">
        <Form.Item
          name="productName"
          label="Mahsulot nomi"
          rules={[{ required: true, message: "Nomini kiriting" }]}
        >
          <Input placeholder="Masalan: Non" />
        </Form.Item>

        <Form.Item
          name="count"
          label="Soni"
          rules={[{ required: true, message: "Mahsulot sonini kiriting" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="takingPrice"
          label="Olish narxi"
          rules={[{ required: true, message: "Olish narxini kiriting" }]}
        >
          <InputNumber
            min={0}
            addonAfter={
              <Form.Item name="valyuta" noStyle>
                <Select style={{ width: 80 }}>
                  <Select.Option value="UZS">UZS</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                </Select>
              </Form.Item>
            }
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Sotish narxi"
          rules={[{ required: true, message: "Sotish narxini kiriting" }]}
        >
          <InputNumber min={0}
             addonAfter={
              <Form.Item name="valyuta" noStyle>
                <Select style={{ width: 80 }}>
                  <Select.Option value="UZS">UZS</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                </Select>
              </Form.Item>
            }
          style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="promotion" label="Chegirma (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="sellingPercentage" label="Sotish foizi (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="Qrcode" label="QR kod">
          <Input placeholder="Masalan: qwerty-12345" />
        </Form.Item>

        <Form.Item
          name="filialId"
          label="Filial"
          rules={[{ required: true, message: "Filialni tanlang" }]}
        >
          <PaginatedSelect endpoint="filial" queryKey="name" placeholder="Filial tanlang" />
        </Form.Item>

        <Form.Item
          name="firmId"
          label="Firma"
          rules={[{ required: true, message: "Firmani tanlang" }]}
        >
          <PaginatedSelect endpoint="firma" queryKey="name" placeholder="Firma tanlang" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Kategoriya"
          rules={[{ required: true, message: "Kategoriyani tanlang" }]}
        >
          <PaginatedSelect endpoint="categories" queryKey="name" placeholder="Kategoriya tanlang" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {id ? "Yangilash" : "Yaratish"}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default CreateProduct;
