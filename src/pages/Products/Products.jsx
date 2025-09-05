import { Button, Modal, Form, Input, Table, Space, Popconfirm, message, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { useInfoContext } from "../../context/infoContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
   const navigate = useNavigate();
  const {defaultUser, addTab} = useInfoContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [data, setData] = useState(defaultUser || []);
  const [form] = Form.useForm();

  // Qo‘shish / Tahrirlash
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newEmp = {
        id: editing ? editing.id : Date.now(),
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
      };

      if (editing) {
        setData(prev => prev.map(emp => (emp.id === editing.id ? newEmp : emp)));
        message.success("Tavar yangilandi!");
      } else {
        setData(prev => [...prev, newEmp]);
        message.success("Tavar qo‘shildi!");
      }

      form.resetFields();
      setEditing(null);
      setOpen(false);
    });
  };

  // O‘chirish
  const handleDelete = id => {
    setData(prev => prev.filter(emp => emp.id !== id));
    message.success("Tavar o‘chirildi!");
  };

  const columns = [
    { title: "Ism", dataIndex: "firstname" },
    { title: "Familiya", dataIndex: "lastname" },
    { title: "Telefon", dataIndex: "phone" },
    { title: "Lavozim", dataIndex: "position" },
    { title: "Maosh", dataIndex: "salary" },
    { title: "Boshlagan sana", dataIndex: "startDate" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                ...record,
                startDate: dayjs(record.startDate),
              });
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Tavarni o‘chirishni xohlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Tepada btn */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {navigate("/products/new"); addTab("Tovar yaratish", "/products/new", 'PlusOutlined')}}
        style={{ marginBottom: 16 }}
      >
        Tavar qo‘shish
      </Button>

      {/* Pastda jadval */}
      <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />

      {/* Modal */}
      <Modal
        title={editing ? "Tavarni tahrirlash" : "Yangi Tavar qo‘shish"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstname" label="Ism" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Familiya" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Lavozim" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Maosh" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="startDate" label="Boshlagan sana" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
