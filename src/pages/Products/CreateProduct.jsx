import { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getReq } from "../../services/getRequeset";
import axios from "axios";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import ImageUpload from "../../components/UI/ImageUpload";
const CreateProduct = () => {
  const [form] = Form.useForm();
  const { id } = useParams(); // agar id bo‘lsa → update rejim
  const navigate = useNavigate();
  
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Update rejimida mahsulotni olish
  const fetchProduct = async () => {
    if (!id) return;
    try {
      const res = await getReq(`products/${id}`);
      const product = res.data;
      form.setFieldsValue({
        productName: product.productName,
        count: product.count,
        takingPrice: product.takingPrice,
        sellingPrice: product.sellingPrice,
        promotion: product.promotion,
        filialId: product.filialId,
        firmId: product.firmId,
        categoryId: product.categoryId,
      });
    } catch (err) {
      message.error("Mahsulotni olishda xatolik!");
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 🔹 Submit
  const onFinish = async (values) => {
    return console.log(values);
    
    try {
      setLoading(true);
      if (id) {
        // Update
        await axios.put(`/products/${id}`, values);
        message.success("Mahsulot yangilandi!");
      } else {
        // Create
        const res = await axios.post("/products", values);
        console.log(res);
        
        message.success("Mahsulot qo‘shildi!");
      }
      navigate("/products"); // qaytarish
    } catch (err) {
      console.log(err);
      
      message.error("Saqlashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const priceSelect = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="USD">USD</Select.Option>
        <Select.Option value="UZS">UZS</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="md:flex gap-6 items-start"
    >
     <div className="flex justify-center items-center w-full md:w-1/3">
        <Form.Item label="Mahsulot rasmi" className="text-center">
          <ImageUpload imageStyle='card' fileList={fileList} setFileList={setFileList} limit={1}/>
        </Form.Item>
      </div>
      {/* O‘ng tomonda inputlar */}
      <div className="w-full">
        <Form.Item
          name="productName"
          label="Mahsulot nomi"
          rules={[{ required: true, message: "Nomini kiriting" }]}
        >
          <Input placeholder="Mahsulot nomi" />
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
          <InputNumber addonAfter={priceSelect} min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Sotish narxi"
          rules={[{ required: true, message: "Sotish narxini kiriting" }]}
        >
          <InputNumber addonAfter={priceSelect} min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="promotion" label="Chegirma (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="filialId"
          label="Filial"
          rules={[{ required: true, message: "Filial tanlang" }]}
        >
          <PaginatedSelect endpoint="filial" queryKey="name" placeholder="Filial tanlang" />
        </Form.Item>

        <Form.Item
          name="firmId"
          label="Firma"
          rules={[{ required: true, message: "Firma tanlang" }]}
        >
          <PaginatedSelect endpoint="firma" queryKey="name" placeholder="Firma tanlang" />
        </Form.Item>

        <Form.Item
          name="firmId"
          label="Firma"
          rules={[{ required: true, message: "Categoryani tanlang" }]}
        >
          <PaginatedSelect endpoint="categorys" queryKey="name" placeholder="Categoryani tanlang" />
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
