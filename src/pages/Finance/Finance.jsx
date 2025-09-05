// import React from 'react'

// const Finance = () => {
//   return (
//     <div>Finance</div>
//   )
// }

// export default Finance

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Employees = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // fake data
    setData([
      { id: 1, firstname: "Ali", lastname: "Valiyev", phone: "998901112233" },
      { id: 2, firstname: "Laylo", lastname: "Karimova", phone: "998909998877" },
    ]);
  }, []);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editing) {
        setData(prev =>
          prev.map(emp => (emp.id === editing.id ? { ...emp, ...values } : emp))
        );
        message.success("Employee updated!");
      } else {
        setData(prev => [...prev, { id: Date.now(), ...values }]);
        message.success("Employee added!");
      }
      form.resetFields();
      setEditing(null);
      setOpen(false);
    });
  };

  const handleDelete = id => {
    setData(prev => prev.filter(emp => emp.id !== id));
    message.success("Employee deleted!");
  };

  const columns = [
    { title: "Firstname", dataIndex: "firstname" },
    { title: "Lastname", dataIndex: "lastname" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Employee
      </Button>

      <Table rowKey="id" dataSource={data} columns={columns} />

      <Modal
        title={editing ? "Edit Employee" : "Add Employee"}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstname" label="Firstname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Lastname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
