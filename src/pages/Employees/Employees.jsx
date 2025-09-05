import { Button, Modal, Form, Input, Table, Space, Popconfirm, message, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { useInfoContext } from "../../context/infoContext";

const Employees = () => {
  const {defaultUser} = useInfoContext();
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
        message.success("Xodim yangilandi!");
      } else {
        setData(prev => [...prev, newEmp]);
        message.success("Xodim qo‘shildi!");
      }

      form.resetFields();
      setEditing(null);
      setOpen(false);
    });
  };

  // O‘chirish
  const handleDelete = id => {
    setData(prev => prev.filter(emp => emp.id !== id));
    message.success("Xodim o‘chirildi!");
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
            title="Xodimni o‘chirishni xohlaysizmi?"
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
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Xodim qo‘shish
      </Button>

      {/* Pastda jadval */}
      <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />

      {/* Modal */}
      <Modal
        title={editing ? "Xodimni tahrirlash" : "Yangi xodim qo‘shish"}
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

export default Employees;
