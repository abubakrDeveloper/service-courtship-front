import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Space,
  Tabs,
  Pagination,
  InputNumber,
  Avatar,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from "@ant-design/icons";
import PaginatedSelect from "../../components/UI/PaginatedSelect";
import { useInfoContext } from "../../context/infoContext";
import { getReq } from "../../services/getRequeset";
import { patchReq, updateReq } from "../../services/putRequest";
import { addReq } from "../../services/addRequest";
import { deleteReq } from "../../services/deleteRequest";

const { TabPane } = Tabs;
const pageSizeDefault = 10;

export default function Settings() {
  const { currentUser, success, error } = useInfoContext();
  const [activeTab, setActiveTab] = useState("firma");
  const [filters, setFilters] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSizeDefault,
    total: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  // --- Dynamic endpoint & fields per tab
  const tabConfig = {
    firma: {
      title: "Firma",
      endpoint: "firma",
      columns: [
        { title: "Nomi", dataIndex: "name" },
        { title: "Kategoriya", dataIndex: "category" },
        { title: "Boshlangan sana", dataIndex: "startedAt" },
      ],
      formFields: (
        <>
          <Form.Item
            name="name"
            label="Firma nomi"
            rules={[{ required: true, message: "Firma nomini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategoriya"
            rules={[{ required: true, message: "Kategoriya kiriting" }]}
          >
            <PaginatedSelect endpoint="categories" queryKey="name" />
          </Form.Item>
          <Form.Item name="startedAt" label="Boshlangan sana">
            <Input type="date" />
          </Form.Item>
        </>
      ),
      defaultValues: { magazinId: currentUser?.magazinId },
    },

    filial: {
      title: "Filial",
      endpoint: "filial",
      columns: [
        {
          title: "Logo",
          dataIndex: "logo",
          render: (image) => (
            <Avatar size={45} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
            shape="square" 
            src={image}
            icon={<ShopOutlined />} />
          ),
        },
        { title: "Nomi", dataIndex: "name" },
        { title: "Magazin ID", dataIndex: "magazinId" },
      ],
      formFields: (
        <>
          <Form.Item
            name="name"
            label="Filial nomi"
            rules={[{ required: true, message: "Filial nomini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="logo" label="Logo URL">
            <Input />
          </Form.Item>
        </>
      ),
      defaultValues: { magazinId: currentUser?.magazinId },
    },

    categories: {
      title: "Kategoriya",
      endpoint: "categories",
      columns: [
        {
          title: "Rasm",
          dataIndex: "image",
          render: (image) => (
            <Avatar size={45} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
            shape="square" 
            src={image}
            icon={<ShopOutlined />} />
          ),
        },
        { title: "Nomi", dataIndex: "name" },
        { title: "Filial", dataIndex: "filialId" },
      ],
      formFields: (
        <>
          <Form.Item
            name="name"
            label="Kategoriya nomi"
            rules={[{ required: true, message: "Nomi kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Rasm URL">
            <Input />
          </Form.Item>
          <Form.Item
            name="filialId"
            label="Filial"
            rules={[{ required: true, message: "Filial tanlang" }]}
          >
            <PaginatedSelect endpoint="filial" queryKey="name" />
          </Form.Item>
        </>
      ),
    },

    service: {
      title: "Service",
      endpoint: "service",
      columns: [
        { title: "Nomi", dataIndex: "name" },
        { title: "Filial ID", dataIndex: "filialId" },
      ],
      formFields: (
        <>
          <Form.Item
            name="name"
            label="Xizmat nomi"
            rules={[{ required: true, message: "Nomini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="filialId"
            label="Filial"
            rules={[{ required: true, message: "Filial tanlang" }]}
          >
            <PaginatedSelect endpoint="filial" queryKey="name" />
          </Form.Item>
        </>
      ),
    },

    completedService: {
      title: "Bajarilgan xizmatlar",
      endpoint: "completed-service",
      columns: [
        { title: "Mijoz", dataIndex: "mijoz" },
        { title: "Narxi", dataIndex: "price" },
        { title: "Xizmat haqida", dataIndex: "aboutService" },
        { title: "Chegirma (%)", dataIndex: "promotion" },
        { title: "Service ID", dataIndex: "serviceId" },
      ],
      formFields: (
        <>
          <Form.Item
            name="mijoz"
            label="Mijoz"
            rules={[{ required: true, message: "Mijoz nomini kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Narxi">
            <Input placeholder="Masalan: 150 000" />
          </Form.Item>
          <Form.Item name="aboutService" label="Xizmat haqida">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="promotion" label="Chegirma (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="serviceId"
            label="Service"
            rules={[{ required: true, message: "Service tanlang" }]}
          >
            <PaginatedSelect endpoint="service" queryKey="name" />
          </Form.Item>
        </>
      ),
    },
  };

  const cfg = tabConfig[activeTab];
  
  // Fetch data
  const fetchData = useCallback(
    async ({ page, limit }) => {
      try {
        const params = new URLSearchParams({
        ...(filters.name && { name: filters.name }),
        page,
        limit,
      });  
        setLoading(true);
        const { data } = await getReq(`${cfg.endpoint}?${params.toString()}`);
        console.log(data);
        
        setData(data.data || data.items || []);
        setPagination({
          ...pagination,
          total: data.total || 0,
          page,
          limit,
        });
      } catch (err) {
        error("Ma’lumotlarni olishda xatolik!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [cfg, pagination.limit]
  );

  useEffect(() => {
    fetchData({ page: 1, limit: pagination.limit });
  }, [activeTab, filters]);

  // --- CRUD
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    setClicked(true)
    try {
      const values = await form.validateFields();
      const body = { ...cfg.defaultValues, ...values };

      if (editing) {
        if(cfg.endpoint === 'filial'){
          await updateReq(editing.id, body, cfg.endpoint);
        } else {
          await patchReq(editing.id, body, cfg.endpoint);
        }
        success(`${cfg.title} yangilandi`);
      } else {
        await addReq(body, cfg.endpoint);
        success(`${cfg.title} yaratildi`);
      }

      setModalVisible(false);
      setClicked(false)
      fetchData({ page: pagination.page, limit: pagination.limit });
    } catch (err) {
      error("Saqlashda xatolik yuz berdi");
      console.error(err);
      setClicked(false)
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReq(id, cfg.endpoint);
      success(`${cfg.title} o‘chirildi`);
      fetchData({ page: pagination.page, limit: pagination.limit });
    } catch (err) {
      error("O‘chirishda xatolik!");
      console.error(err);
    }
  };

  const columns = [
    ...cfg.columns,
    {
      title: "Amallar",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="O‘chirishni tasdiqlang"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{display: 'flex', justifyContent: 'space-between', gap: "20px"}}>
        <h1 className="text-2xl font-bold mb-6">Sozlamalar</h1>
         <Input.Search
            style={{maxWidth: '300px'}}
            placeholder="Nomi bo‘yicha qidirish"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            onSearch={() => fetchProducts({ page: 1, limit: pagination.pageSize })}
            allowClear
          />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {Object.keys(tabConfig).map((key) => (
          <TabPane key={key} tab={tabConfig[key].title}>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {tabConfig[key].title} ro‘yxati
              </h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreate}
              >
                Yangi qo‘shish
              </Button>
            </div>

            <Table
              rowKey={(r) => r.id}
              columns={columns}
              dataSource={loading ? [] : data}
              loading={loading}
              pagination={false}
              bordered
            />

            <div style={{ marginTop: 12, display: "flex", justifyContent: "end" }}>
              <Pagination
                current={pagination.page}
                pageSize={pagination.limit}
                total={pagination.total}
                onChange={(page, pageSize) =>
                  fetchData({ page, limit: pageSize })
                }
                showSizeChanger
                pageSizeOptions={["5", "10", "20", "50"]}
              />
            </div>
          </TabPane>
        ))}
      </Tabs>

      <Modal
        open={modalVisible}
        title={
          editing
            ? `${cfg.title}ni tahrirlash`
            : `Yangi ${cfg.title.toLowerCase()} qo‘shish`
        }
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        loading={clicked}
        okText={editing ? "Yangilash" : "Saqlash"}
      >
        <Form form={form} layout="vertical">
          {cfg.formFields}
        </Form>
      </Modal>
    </div>
  );
}
