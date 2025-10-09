import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, Avatar, Input, Select, Row, Col} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ShopOutlined } from "@ant-design/icons";
import { useInfoContext } from "../../context/infoContext";
import { getReq } from "../../services/getRequeset";
import PreviewDrawer from "../../components/UI/PreviewDrawer";
import { deleteReq } from "../../services/deleteRequest";
import PaginatedSelect from "../../components/UI/PaginatedSelect";


const Employees = () => {
  const { addTab, error, success, currentUser } = useInfoContext();
  const [filters, setFilters] = useState({
    productName: "",
    filialId: currentUser.filialId || "",
    firmId: "",
    categoryId: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 🔹 Backenddan ma’lumot olish
  const fetchEmployees = async ({ page, limit }) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...(filters.productName && { productName: filters.productName }),
        ...(filters.filialId && { filialId: filters.filialId }),
        ...(filters.firmId && { firmId: filters.firmId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        page,
        limit,
      });  

      const {data} = await getReq(`admins`); 
           
      setData(data.data);
      setPagination({
        current: data.page,
        pageSize: data.limit,
        total: data.total,
      });
    } catch (err) {
      console.error("Xodimlarni olishda xatolik:", err);
      error("Ma’lumotlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchEmployees({ page: 1, limit: pagination.pageSize });
  }, [filters]);


  // 🔹 O‘chirish
  const handleDelete = async (data) => {
    try {
      if(data.image){
        const filename = data.image.split("/").pop();
        await deleteReq(filename, "files/delete");
      }
      await deleteReq(data.id, `admins`);
      success("Xodim o‘chirildi!");
      fetchEmployees({ page: pagination.current, limit: pagination.pageSize });
    } catch (err) {
      error("O‘chirishda xatolik!");
    }
  };

  const columns = [
    {
      title: "Rasmi",
      dataIndex: "image",
      render: (image) => (
        image ? (
          <img
            src={`${import.meta.env.VITE_SERVER_URL}${image}`}
            alt="Xodim rasmi"
            style={{ width: 60, height: 50, objectFit: "contain", borderRadius: 8 }}
          />
        ) : (
          <Avatar size={45} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          shape="square" 
          icon={<ShopOutlined />} />
        )
      ),
    },
    { title: "Ism", dataIndex: "firstName" },
    { title: "Familiya", dataIndex: "lastName" },
    { title: "Lavozim", dataIndex: "role" },
    { title: "Telefon raqam", dataIndex: "phone" },
    { title: "Qo'shilgan sanasi", dataIndex: "date",  render: (date) => {
      if (!date) return "----";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}.${month}.${year}`; // masalan: 07.10.2025
    }},
    { title: `QR kodi`, dataIndex: "Qrcode" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {setOpen(true); setPreview(record)}}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              addTab("Tahrirlash", `/admins/edit/${record.id}`, "EditOutlined")
            }
          />
          <Popconfirm
            title="Xodimni o‘chirishni xohlaysizmi?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];  

  return (
    <div>
      {/* 🔍 Filtrlar paneli */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          {/* Tepada btn */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addTab("Xodim qo‘shish", "/employees/new", "PlusOutlined")}
          >
            Xodim qo‘shish
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input.Search
            placeholder="Xodim ismi bo‘yicha qidirish"
            value={filters.productName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, productName: e.target.value }))
            }
            onSearch={() => fetchEmployees({ page: 1, limit: pagination.pageSize })}
            allowClear
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <PaginatedSelect
            endpoint="filial"
            queryKey="name"
            placeholder="Filial bo‘yicha qidirish"
            value={filters.filialId}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, filialId: value }));
              fetchEmployees({ page: 1, limit: pagination.pageSize }); // 🔄 avtomatik filter
            }}
          />
        </Col>
      </Row>



      {/* Jadval */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            fetchEmployees({ page, limit: pageSize });
          },
        }}
      />
      <PreviewDrawer open={open} onClose={() => setOpen(false)} preview={preview}/>
    </div>
  );
};

export default Employees;
