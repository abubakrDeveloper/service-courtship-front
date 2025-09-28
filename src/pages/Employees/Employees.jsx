import { Button, Form, Table, Space, Popconfirm, message, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { useInfoContext } from "../../context/infoContext";
import { Outlet } from "react-router-dom";

const Employees = () => {
  const {defaultUser, addTab} = useInfoContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [data, setData] = useState(defaultUser || []);
  const [form] = Form.useForm();

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
        onClick={() => addTab("Xodim qo‘shish", "/employees/new", "PlusOutlined")}
        style={{ marginBottom: 16 }}
      >
        Xodim qo‘shish
      </Button>

      {/* Pastda jadval */}
      <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />
      <Outlet />
    </div>
  );
};

export default Employees;
