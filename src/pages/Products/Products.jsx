import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, Avatar, Input, Select, Row, Col} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ShopOutlined } from "@ant-design/icons";
import { useInfoContext } from "../../context/infoContext";
import axios from "axios";
import { getReq } from "../../services/getRequeset";
import PreviewDrawer from "../../components/UI/PreviewDrawer";
import { deleteReq } from "../../services/deleteRequest";
import PaginatedSelect from "../../components/UI/PaginatedSelect";


const Products = () => {
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
  const fetchProducts = async ({ page, limit }) => {
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

      // console.log("YYYYYYY",params);
      console.log(`products?${params.toString()}`);
      

      const {data} = await getReq(`products?${params.toString()}`); 
      console.log(data);
           
      setData(data.data);
      setPagination({
        current: data.page,
        pageSize: data.limit,
        total: data.total,
      });
    } catch (err) {
      console.error("Mahsulotlarni olishda xatolik:", err);
      error("Ma’lumotlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchProducts({ page: 1, limit: pagination.pageSize });
  }, [filters]);


  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    try {
      await deleteReq(id, `products`);
      success("Mahsulot o‘chirildi!");
      fetchProducts({ page: pagination.current, limit: pagination.pageSize });
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
            alt="Mahsulot rasmi"
            style={{ width: 60, height: 50, objectFit: "contain", borderRadius: 8 }}
          />
        ) : (
          <Avatar size={45} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          shape="square" 
          icon={<ShopOutlined />} />
        )
      ),
    },
    { title: "Nomi", dataIndex: "productName" },
    { title: "Olish narxi", dataIndex: "takingPrice" },
    { title: "Sotish narxi", dataIndex: "sellingPrice" },
    { title: "Valyuta", dataIndex: "valyuta" },
    { title: "Sotish foizi", dataIndex: "sellingPercentage", render: (sellingPercentage) => {
      return `${sellingPercentage}%`
    }},
    { title: "Chegirma (%)", dataIndex: "promotion", render: (promotion) => {
      return `${promotion}%`
    } },
    { title: "Soni", dataIndex: "count" },
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
            onClick={(e) => {setOpen(true); setPreview(record)}}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              addTab("Tahrirlash", `/products/edit/${record.id}`, "EditOutlined")
            }
          />
          <Popconfirm
            title="Mahsulotni o‘chirishni xohlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  console.log(filters);
  

  return (
    <div>
      {/* Tepada btn */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => addTab("Mahsulot qo‘shish", "/products/new", "PlusOutlined")}
        style={{marginBottom: "16px"}}
      >
        Mahsulot qo‘shish
      </Button>

      {/* 🔍 Filtrlar paneli */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input.Search
            placeholder="Mahsulot nomi bo‘yicha qidirish"
            value={filters.productName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, productName: e.target.value }))
            }
            onSearch={() => fetchProducts({ page: 1, limit: pagination.pageSize })}
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
              fetchProducts({ page: 1, limit: pagination.pageSize }); // 🔄 avtomatik filter
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <PaginatedSelect
            endpoint="firma"
            queryKey="name"
            placeholder="Firma bo‘yicha qidirish"
            value={filters.firmId}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, firmId: value }));
              fetchProducts({ page: 1, limit: pagination.pageSize }); // 🔄 avtomatik filter
            }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <PaginatedSelect
            endpoint="categories"
            queryKey="name"
            placeholder="Kategoriya bo‘yicha qidirish"
            value={filters.categoryId}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, categoryId: value }));
              fetchProducts({ page: 1, limit: pagination.pageSize }); // 🔄 avtomatik filter
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
            fetchProducts({ page, limit: pageSize });
          },
        }}
      />
      <PreviewDrawer open={open} onClose={() => setOpen(false)} preview={preview}/>
    </div>
  );
};

export default Products;
