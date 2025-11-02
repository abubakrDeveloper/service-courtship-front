import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Card,
  Row,
  Col,
  Divider,
  Popconfirm,
  Avatar,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getReq } from "../../services/getRequeset";
import { patchReq } from "../../services/putRequest";
import { addReq } from "../../services/addRequest";
import { useInfoContext } from "../../context/infoContext";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import ImageUpload from "../../components/UI/ImageUpload";
import { PlusOutlined, DeleteOutlined, EditOutlined, ShopOutlined, DatabaseOutlined } from "@ant-design/icons";
import { useProductStore } from "../../store/useProductStore";
import { deleteReq } from "../../services/deleteRequest";

const CreateProduct = () => {
  const { removeTab, addTab, success, error, currentUser, activeKey, warning} = useInfoContext();
  const { itemList, addProduct, removeProduct, setProductList, formValues, setFormValues, clearFormValues, editingIndex, setEditingIndex, updateProduct } = useProductStore();
  const [form] = Form.useForm();
  const { id } = useParams();

  const [fileUrl, setFileUrl] = useState("");
  const [percentage, setPercentage] = useState(form.getFieldValue('sellingPercentage') || 0);
  const [takingPrice, setTakingPrice] = useState(form.getFieldValue('takingPrice') || 0);
  const [loading, setLoading] = useState(false);

  // ✅ rasm o‘zgarsa formValues ichiga yozib boramiz
  useEffect(() => {
    if (fileUrl) {
      setFormValues(prev => ({ ...prev, image: fileUrl }));
      form.setFieldsValue({ image: fileUrl }); // ✅ shu shart!
    }
  }, [fileUrl]);

  useEffect(() => {
     if (takingPrice && percentage >= 0) {
      if(form.getFieldValue('sellingPrice')){
        setFormValues(prev => ({ ...prev,  sellingPrice: takingPrice }));
        form.setFieldsValue({ sellingPrice: takingPrice });
      }
      const cheked = percentage !== 0 ? (takingPrice * percentage / 100) + takingPrice : takingPrice
      setFormValues(prev => ({ ...prev, takingPrice, sellingPercentage: percentage, sellingPrice: cheked }));
      form.setFieldsValue({ takingPrice, sellingPercentage: percentage, sellingPrice: cheked }); // ✅ shu shart!
    }
  }, [takingPrice, percentage]);

  console.log(takingPrice, percentage, form.getFieldValue('sellingPrice'));


   useEffect(() => {
    if (id) return;

    if (!editingIndex) {
      form.resetFields();
      form.setFieldsValue({
        ...formValues,
        valyuta: "UZS",
        sellingType: "KG",
        filialId: currentUser?.filialId || null
      });
      setFileUrl(formValues.image || "");
    }
  }, [activeKey]); // 



  // ✅ Form o‘zgarsa — store ga yozish
  const handleFormChange = (_, allValues) => {
    // ❗️ image qo‘shilmaydi, faqat input qiymatlari
    setFormValues(allValues);
  };

  // Listdagi tavarni o'zgartirish
  const handleEdit = (index) => {
    const product = itemList[index];
    form.setFieldsValue(product);
    setFileUrl(product.image || "");
    setEditingIndex(index);
  };

  // ✅ Tavarni olish (update rejimi uchun)
  const fetchProduct = async () => {
    try {
      const res = await getReq(`products/${id}`);
      console.log(res);
      
      const product = res.data;
      form.setFieldsValue(product);
      setFileUrl(product.image || "");
    } catch {
      error("Tavarni olishda xatolik!");
    }
  };
  
  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ✅ Listga qo‘shish yoki yangilash
  const handleAddToList = async () => {
    if (!fileUrl) return warning("Rasm yuklanmagan");
    const values = await form.validateFields();
    const newProduct = {
      ...values,
      valyuta: values.valyuta || "UZS",
      sellingType: values.sellingType || "KG",
      image: fileUrl, // rasm
    };

    if (id) {
      // UPDATE mode (serverdan kelgan)
      await patchReq(id, newProduct, "products");
      success("Tavar yangilandi");
      removeTab(activeKey);
      return;
    }
    
    if (editingIndex !== null) {
      updateProduct(editingIndex, newProduct);
      setEditingIndex(null);
    } else {
      addProduct(newProduct);
    }

    form.resetFields(); // reset
    setFileUrl("");
    setFormValues({});
    form.setFieldsValue({
      valyuta: "UZS", // ✅ resetdan keyin qaytarib qo‘yish
      sellingType: "KG", // ✅ resetdan keyin qaytarib qo‘yish
      filialId: currentUser?.filialId // ✅ default filial qayta chiqishi
    });
  };

  // ✅ Listdan o‘chirish
  const handleRemove = (index) => {removeProduct(index)};

  // ✅ Yuborish (bulk)
  const handleSubmit = async () => {
    if (!itemList.length) {
      return warning("Kamida bitta tavar qo‘shing!");
    }

    try {
      setLoading(true);
      // Yangi qo‘shish rejimi — har bir tavarni alohida yuboramiz
      await Promise.all(
        itemList.map(async (item) => {
          await addReq(item, "products");
        })
      );
      success("Barcha tavarlar qo‘shildi!");

      setProductList([]);
      clearFormValues();
      addTab('Tovarlar', '/products', "OrderedListOutlined")
      removeTab(activeKey);
    } catch (err) {
      console.error(err);
      error("Saqlashda xatolik!");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const tempFiles = JSON.parse(localStorage.getItem("productFiles") || "[]");

    // ✅ Faqat yangi product qo‘shilayotganda (update emas)
    if (!editingIndex && tempFiles.length > 0) {
      // Agar formada yoki fileUrl'da rasm bo'lmasa – oldingi vaqtinchalik rasmlarni tozalaymiz
      if (!formValues?.image) {
        tempFiles.forEach(async (img) => {
          const filename = img.split("/").pop();
          await deleteReq(filename, "files/delete");
        });
        localStorage.removeItem("productFiles");
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (itemList.length > 0 || fileUrl) {
        e.preventDefault();
        e.returnValue = "Sahifani yangilasangiz ma'lumotlar o‘chib ketadi!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [itemList, fileUrl]);



  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange} // ✅ form kuzatuv
        className="md:flex gap-6 items-start"
      >
        {/* Chapda — Rasm */}
        <div className="flex-col-reverse justify-center items-center md:w-1/2">
         {itemList.length > 0 && (
          <>
            <div className="flex gap-3 w-full items-center justify-between mb-5">
              <b className="md:text-lg">Jarayondagi tavarlar: <span style={{color: "blue"}}>{itemList.length}</span></b>
              <Button type="primary" iconPosition="end" disabled={itemList.length <= 0} onClick={handleSubmit} loading={loading}>
                Yuklash
                <DatabaseOutlined />
              </Button>
            </div>
            <Row gutter={[4, 4]} className="products_list">
              {itemList.map((item, index) => (
                <Col key={index}>
                  <Card
                    style={{width: '100px'}}
                    size="small"
                    title={item.productName}
                    extra={
                      <>
                        <Popconfirm title="Tavarni o‘chirish?" onConfirm={() => handleRemove(index)}>
                          <DeleteOutlined style={{ marginRight: 10, color: "red", cursor: "pointer" }} />
                        </Popconfirm>
                        <EditOutlined
                          style={{color: "blue", cursor: "pointer" }}
                          onClick={() => handleEdit(index)}
                        />
                      </>
                    }
                  >
                  {
                    item.image ? (
                      <img
                        className="w-full"
                        src={`${import.meta.env.VITE_SERVER_URL}${item.image}`}
                        alt={item.productName}
                        style={{objectFit: "contain", width: '100%', height: '80px'}}
                      />
                    ) : (<Avatar className="w-full" style={{ backgroundColor: '#fde3cf', color: '#f56a00', fontSize: '30px', width: '100%', height: '80px', padding: "20px 0"}}
                        shape="square" 
                        icon={<ShopOutlined />} />)
                    }
                  </Card>
                </Col>
              ))}
            </Row>
          </>
      )}
        </div>

        {/* O‘ngda — Ma’lumotlar */}
        <div className="w-full">
           <div className="md:flex items-center justify-center w-full gap-5">
            <Form.Item label="Tavar rasmi" className="mx-auto md:w-1/5" name="image">
              <ImageUpload
                source="product"
                imageStyle="card"
                fileUrl={fileUrl}
                setFileUrl={setFileUrl}
                limit={1}
              />
            </Form.Item>
            <div className="w-full">
              <Form.Item
              name="productName"
              label="Tavar nomi"
              rules={[{ required: true, message: "Nomini kiriting" }]}
              >
                <Input placeholder="Nomi" />
              </Form.Item>

              <Form.Item name="count" label="Tavar soni" rules={[{ required: true, message: "Sonini kiriting" }]}>
                <InputNumber placeholder="0" min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="countType"
                label="Tavar hajmi"
                rules={[{ required: true, message: "Tavar hajmini kiriting" }]}
              >
                <InputNumber
                  placeholder="0"
                  min={0}
                  addonAfter={
                    <Form.Item name="sellingType" noStyle>
                      <Select style={{ width: 80 }}>
                        <Select.Option value="KG">KG</Select.Option>
                        <Select.Option value="DONA">Dona</Select.Option>
                        <Select.Option value="L">L</Select.Option>
                        <Select.Option value="M">M</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="takingPrice"
            label="Tavar olish narxi"
            rules={[{ required: true, message: "Olish narxini kiriting" }]}
          >
            <InputNumber
              placeholder="10000"
              min={0}
              onChange={(e) => setTakingPrice(e)}
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

          <Form.Item name="sellingPercentage" label="Tavar sotish foizi (%)" rules={[{ required: true, message: "" }]}>
            <InputNumber  onChange={(e) => setPercentage(e)} placeholder="0" min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="sellingPrice"
            label="Tavar sotish narxi"
            rules={[{ required: true, message: "Sotish narxini kiriting" }]}
          >
            <InputNumber
              placeholder="0"
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

          {id && <Form.Item name="promotion" label="Tavar chegirma foizi (%)" rules={[{ required: true, message: "Chegirma foizini kiriting" }]}>
            <InputNumber placeholder="0" min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>}

          <Form.Item name="Qrcode" label="Tavar QR kodi" rules={[{ required: true, message: "Qr kodni kiriting" }]}>
            <Input placeholder="1234567890123" />
          </Form.Item>

          <Form.Item  initialValue={currentUser?.filialId} name="filialId" label="Tavar qo'shilishi kerak bo'lgan filial" rules={[{ required: true, message: "Filialni tanlang" }]}>
            <PaginatedSelect
              endpoint="filial"
              queryKey="name"
              value={currentUser.filialId}
              placeholder="Filial tanlang"
            />
          </Form.Item>

          <Form.Item name="firmId" label="Tavarga tegishli firma" rules={[{ required: true, message: "Firmani tanlang" }]}>
            <PaginatedSelect
              endpoint="firma"
              queryKey="name"
              placeholder="Firma tanlang"
            />
          </Form.Item>

          <Form.Item name="categoryId" label="Tavar kategoriyasi" rules={[{ required: true, message: "Kategoryasini tanlang" }]}>
            <PaginatedSelect
              endpoint="categories"
              queryKey="name"
              placeholder="Kategoriya tanlang"
            />
          </Form.Item>

          <div>
            <Button type="primary" icon={id || editingIndex ? <EditOutlined /> : <PlusOutlined />} onClick={handleAddToList}>
              {id || editingIndex ? "O'zgarishni saqlash" : "Listga qo‘shish"}
            </Button>
          </div>
        </div>
      </Form>
      </div>
  );
};

export default CreateProduct;
