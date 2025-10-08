import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Card,
  Row,
  Col,
  Divider,
  Popconfirm,
} from "antd";
import { useParams } from "react-router-dom";
import { getReq } from "../../services/getRequeset";
import { updateReq } from "../../services/putRequest";
import { addReq } from "../../services/addRequest";
import { useInfoContext } from "../../context/infoContext";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import ImageUpload from "../../components/UI/ImageUpload";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useShopStore } from "../../store/useShopStore";

const CreateProduct = () => {
  const { removeTab, success, error, currentUser, activeKey} = useInfoContext();
  const {
    productList,
    addProduct,
    removeProduct,
    setProductList,
    formValues,
    setFormValues,
    clearFormValues,
  } = useShopStore();

  const [form] = Form.useForm();
  const { id } = useParams();

  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Form qiymatlarini local store’dan yuklash
  useEffect(() => {
    if (Object.keys(formValues).length) {
      form.setFieldsValue(formValues);
      if (formValues.image) setFileUrl(formValues.image);
    } else {
      form.setFieldsValue({ valyuta: "UZS" });
    }
  }, []);

  // ✅ Form o‘zgarsa — store ga yozish
  const handleFormChange = (_, allValues) => {
    setFormValues({ ...allValues, image: fileUrl });
  };

  // ✅ Mahsulotni olish (update rejimi uchun)
  const fetchProduct = async () => {
    try {
      const res = await getReq(`products/${id}`);
      console.log(res);
      
      const product = res.data;
      form.setFieldsValue(product);
      setFileUrl(product.image || "");
    } catch {
      message.error("Mahsulotni olishda xatolik!");
    }
  };
  console.log(productList);
  
  useEffect(() => {
    if (!fileUrl && formValues?.image) {
      setFileUrl(formValues.image);
    }
  }, [formValues.image]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ✅ Listga qo‘shish
  // ✅ Listga qo‘shish yoki yangilash
const handleAddToList = async () => {
  const values = await form.validateFields();
  const newProduct = {
    ...values,
    image: fileUrl,
    takingPrice: Number(values.takingPrice),
    sellingPrice: Number(values.sellingPrice),
    valyuta: values.valyuta || "UZS",
  };
  console.log(newProduct);
  
  if (id) {
    // ✳️ Tahrirlash rejimi
    try {
      setLoading(true);
      await updateReq(id, newProduct, "products");
      success("Mahsulot yangilandi!");
      removeTab(activeKey); // oynani yopish
    } catch (err) {
      console.error(err);
      error("Yangilashda xatolik!");
    } finally {
      setLoading(false);
    }
  } else {
    // ✳️ Yangi mahsulot rejimi — listga qo‘shish
    addProduct(newProduct);

    // 🔄 formni tozalaymiz
    form.resetFields();
    form.setFieldsValue({ valyuta: "UZS" });
    setFileUrl("");
    setFormValues({ valyuta: "UZS" });
  }
};


  // ✅ Listdan o‘chirish
  const handleRemove = (index) => {removeProduct(index)};

  // ✅ Yuborish (bulk)
  const handleSubmit = async () => {
    if (!productList.length) {
      return message.warning("Kamida bitta mahsulot qo‘shing!");
    }

    try {
      setLoading(true);

      if (id) {
        // Yangilash rejimi — har bir mahsulotni update qilib chiqamiz
        await Promise.all(
          productList.map(async (item) => {
            await updateReq(item._id, item, "products");
          })
        );
        success("Mahsulotlar yangilandi!");
      } else {
        // Yangi qo‘shish rejimi — har bir mahsulotni alohida yuboramiz
        await Promise.all(
          productList.map(async (item) => {
            await addReq(item, "products");
          })
        );
        success("Barcha mahsulotlar qo‘shildi!");
      }

      // 🔄 Tozalash
      setProductList([]);
      clearFormValues();
      removeTab(activeKey);
    } catch (err) {
      console.error(err);
      error("Saqlashda xatolik!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange} // ✅ form kuzatuv
        className="md:flex gap-6 items-start"
      >
        {/* Chapda — Rasm */}
        <div className="flex-col-reverse justify-center items-center w-1/2">
         {productList.length > 0 && (
          <>
            <Divider>Jarayondagi mahsulotlar</Divider>
            <Row gutter={[4, 4]}>
              {productList.map((item, index) => (
                <Col key={index} span={8}>
                  <Card
                    title={item.productName}
                    extra={
                      <Popconfirm
                      title="Mahsulotni o‘chirishni xohlaysizmi?"
                      onConfirm={() => handleRemove(index)}
                      >
                      <DeleteOutlined
                          style={{ color: "red" }}
                        />
                    </Popconfirm>
                    }
                    cover={
                      item.image ? (
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}${item.image}`}
                          alt={item.productName}
                          style={{ height: 140, objectFit: "contain" }}
                        />
                      ) : null
                    }
                  >
                  </Card>
                </Col>
              ))}
            </Row>
          </>
      )}
        </div>

        {/* O‘ngda — Ma’lumotlar */}
        <div className="w-full">
           <div className="flex items-center justify-center w-full gap-5">
            <Form.Item label="Mahsulot rasmi" className="mx-auto w-1/5" name="image">
              <ImageUpload
                required
                imageStyle="card"
                fileUrl={fileUrl}
                setFileUrl={setFileUrl}
                limit={1}
              />
            </Form.Item>
            <div className="w-full">
              <Form.Item
              name="productName"
              label="Mahsulot nomi"
              rules={[{ required: true, message: "Nomini kiriting" }]}
              >
                <Input placeholder="Nomi" />
              </Form.Item>

              <Form.Item name="count" label="Mahsulot soni" rules={[{ required: true, message: "Sonini kiriting" }]}>
                <InputNumber placeholder="0" min={0} style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="takingPrice"
            label="Mahsulot olish narxi"
            rules={[{ required: true, message: "Olish narxini kiriting" }]}
          >
            <InputNumber
              placeholder="10000"
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
            label="Mahsulot sotish narxi"
            rules={[{ required: true, message: "Sotish narxini kiriting" }]}
          >
            <InputNumber
            placeholder="12000"
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

          <Form.Item name="promotion" label="Mahsulot chegirma foizi (%)" rules={[{ required: true, message: "Chegirma foizini kiriting" }]}>
            <InputNumber placeholder="0" min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="sellingPercentage" label="Mahsulot sotish foizi (%)" rules={[{ required: true, message: "Sotish foizini kiriting" }]}>
            <InputNumber placeholder="0" min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="Qrcode" label="Mahsulot QR kodi" rules={[{ required: true, message: "Qr kodni kiriting" }]}>
            <Input placeholder="1234567890123" />
          </Form.Item>

          <Form.Item name="filialId" label="Mahsulot qo'shilishi kerak bo'lgan filial" rules={[{ required: true, message: "Filialni tanlang" }]}>
            <PaginatedSelect
              endpoint="filial"
              queryKey="name"
              value={currentUser.filialId}
              placeholder="Filial tanlang"
            />
          </Form.Item>

          <Form.Item name="firmId" label="Mahsulotga tegishli firma" rules={[{ required: true, message: "Firmani tanlang" }]}>
            <PaginatedSelect
              endpoint="firma"
              queryKey="name"
              placeholder="Firma tanlang"
            />
          </Form.Item>

          <Form.Item name="categoryId" label="Mahsulot kategoriyasi" rules={[{ required: true, message: "Kategoryasini tanlang" }]}>
            <PaginatedSelect
              endpoint="categories"
              queryKey="name"
              placeholder="Kategoriya tanlang"
            />
          </Form.Item>

          <div className="flex gap-3">
            {!id && <Button type="primary" disabled={productList.length <= 0} onClick={handleSubmit} loading={loading}>
              Barchasini Saqlash
            </Button>}
            <Button type={id ? "primary" : "default"} icon={id ? <EditOutlined /> : <PlusOutlined />} onClick={handleAddToList}>
              {id ? "Yangilash" : "Listga qo‘shish"}
            </Button>
          </div>
        </div>
      </Form>
      </div>
  );
};

export default CreateProduct;
