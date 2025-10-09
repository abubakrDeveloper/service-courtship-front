import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Popconfirm,
  Avatar,
} from "antd";
import { useParams } from "react-router-dom";
import { useInfoContext } from "../../context/infoContext";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import ImageUpload from "../../components/UI/ImageUpload";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { addReq } from "../../services/addRequest";
import { updateReq } from "../../services/putRequest";

const AddEmployees = () => {
  const {
    itemList,
    addEmployee,
    removeEmployee,
    setEmployeeList,
    formValues,
    setFormValues,
    clearFormValues,
    editingIndex,
    setEditingIndex,
    updateEmployee,
    updateEmployeeInList
  } = useEmployeeStore();

  const { removeTab, addTab, success, error, currentUser, activeKey, warning } =
    useInfoContext();

  const [form] = Form.useForm();
  const { id } = useParams();

  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Form change
  const handleFormChange = (_, allValues) => setFormValues(allValues);

  // ✅ Edit
  const handleEdit = (index) => {
    const employee = itemList[index];
    form.setFieldsValue(employee);
    setFileUrl(employee.image || "");
    setEditingIndex(index);
  };

  // ✅ qo‘shish
  const handleAddToList = async () => {
    const values = await form.validateFields();

    if (!fileUrl) return warning("Rasm yuklanmagan!");
    if (values.password !== values.confirmPassword)
      return warning("Parollar mos emas!");

    // ✅ Telefon raqam list ichida borligini tekshirish
    const isDuplicatePhone = itemList.some(
      (item, i) => item.phone === values.phone && i !== editingIndex
    );
    if (isDuplicatePhone) {
      return warning("Bu telefon raqam bilan xodim allaqachon mavjud!");
    }

    const newEmployee = {
      firstname: values.firstname,
      lastname: values.lastname,
      phone: values.phone,
      role: values.role,
      filialId: values.filialId,
      password: values.password,
      image: fileUrl,
    };

    if (editingIndex !== null) {
      updateEmployeeInList(editingIndex, newEmployee);
      setEditingIndex(null);
    } else {
      addEmployee(newEmployee);
    }

    form.resetFields();
    setFileUrl("");
  };


  // ✅ Listdan o‘chirish
  const handleRemove = (index) => removeEmployee(index);

  // ✅ Backendga yuborish
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all(itemList.map((item) => addReq(item, "admins")));
      success("Barcha xodimlar muvaffaqiyatli qo‘shildi ✅");

      setEmployeeList([]);
      clearFormValues();
      removeTab(activeKey);
      addTab("Xodimlar", "/employees");
    } catch (err) {
      console.log(err);
      
      error("Saqlashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <div className="md:flex gap-6 items-start">
          {/* ✅ Left section List */}
          <div className="md:w-1/2">
            {itemList.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <b>
                    Jarayondagi xodimlar:
                    <span style={{ color: "blue" }}> {itemList.length}</span>
                  </b>
                  <Button
                    type="primary"
                    icon={<DatabaseOutlined />}
                    onClick={handleSubmit}
                    loading={loading}
                  >
                    Yuborish
                  </Button>
                </div>
                <Row gutter={[8, 8]}>
                  {itemList.map((item, index) => (
                    <Col key={index}>
                      <Card
                        size="small"
                        title={item.role}
                        extra={
                          <>
                            <Popconfirm
                              title="O'chirishni tasdiqlaysizmi?"
                              onConfirm={() => handleRemove(index)}
                            >
                              <DeleteOutlined
                                style={{
                                  color: "red",
                                  marginRight: 10,
                                  cursor: "pointer",
                                }}
                              />
                            </Popconfirm>
                            <EditOutlined
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => handleEdit(index)}
                            />
                          </>
                        }
                      >
                        {item.image ? (
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}${item.image}`}
                            style={{
                              width: "100%",
                              height: 80,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Avatar
                            icon={<UserOutlined />}
                            shape="square"
                            size={80}
                          />
                        )}
                        <p>{item.lastname} {item.firstname}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>

          {/* ✅ Right section Form */}
          <div className="w-full">
            <Form.Item label="Xodim rasmi" name="image">
              <ImageUpload
                source="employee"
                fileUrl={fileUrl}
                setFileUrl={setFileUrl}
              />
            </Form.Item>

            <Form.Item
              name="firstname"
              label="Ismi"
              rules={[{ required: true, message: "Ismni kiriting" }]}
            >
              <Input placeholder="Ism kiriting" />
            </Form.Item>

            <Form.Item
              name="lastname"
              label="Familiyasi"
              rules={[{ required: true, message: "Familiyasini kiriting" }]}
            >
              <Input placeholder="Familiya kiriting" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Telefon raqami"
              rules={[{ required: true, message: "Telefon raqam kiriting" }]}
            >
              <Input placeholder="+998 90 123 45 67" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Lavozim"
              rules={[{ required: true, message: "Lavozim tanlang" }]}
            >
              <Select placeholder="Lavozim tanlang">
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="MANAGER">Manager</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="filialId"
              label="Filial"
              rules={[{ required: true, message: "Filial tanlang" }]}
              initialValue={currentUser?.filialId}
            >
              <PaginatedSelect endpoint="filial" queryKey="name" />
            </Form.Item>

            <Form.Item label="Yangi parol" name="password" hasFeedback rules={[{ required: !id, message: "Parolni kiriting" }]}>
              <Input.Password min={6} placeholder="Yangi parol (ixtiyoriy)" />
            </Form.Item>

            <Form.Item
              label="Parolni tasdiqlash"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Parolni tasdiqlang" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Parollar mos emas!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Parolni tasdiqlang" />
            </Form.Item>

            <Button
              type="primary"
              icon={editingIndex !== null ? <EditOutlined /> : <PlusOutlined />}
              onClick={handleAddToList}
            >
              {editingIndex !== null
                ? "O'zgarishni saqlash"
                : "Listga qo‘shish"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddEmployees;
