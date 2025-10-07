import { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useInfoContext } from "../../context/infoContext";
import axios from "axios";
import { getReq } from "../../services/getRequeset";

const Products = () => {
  const navigate = useNavigate();
  const { addTab } = useInfoContext();

  const [filters, setFilters] = useState({
    productName: "  ",
    filialId: "",
    firmId: "",
    categoryId: "",
  });

  const [data, setData] = useState([{
  "productName": "Non",
  "count": 10,
  "takingPrice": 4500.5,
  "sellingPrice": 5500,
  "promotion": 10,
  "filialId": "filialId",
  "firmId": "firmaId",
  "categoryId": "Kategoriya"
}]);
  const [loading, setLoading] = useState(false);

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

      console.log("YYYYYYY",params);
      

      const {data} = await getReq(`products?${params.toString()}`);      
      // setData(data.data);
      setPagination({
        current: data.page,
        pageSize: data.limit,
        total: data.total,
      });
    } catch (err) {
      console.error("Mahsulotlarni olishda xatolik:", err);
      message.error("Ma’lumotlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sahifa yuklanganda
  useEffect(() => {
    fetchProducts({ page: 1, limit: pagination.pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 O‘chirish
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      message.success("Mahsulot o‘chirildi!");
      fetchProducts({ page: pagination.current, limit: pagination.pageSize });
    } catch (err) {
      message.error("O‘chirishda xatolik!");
    }
  };

  const columns = [
    { title: "Mahsulot nomi", dataIndex: "productName" },
    { title: "Soni", dataIndex: "count" },
    { title: "Olish narxi", dataIndex: "takingPrice" },
    { title: "Sotish narxi", dataIndex: "sellingPrice" },
    { title: "Chegirma", dataIndex: "promotion" },
    { title: "Firma", dataIndex: "firmId" },
    { title: "Filial", dataIndex: "filialId" },
    { title: "Kategoriya", dataIndex: "categoryId" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          {/* Ko‘rish */}
          <Button
            icon={<EyeOutlined />}
            onClick={() => addTab("Mahsulot", `/products/${record.id}`, "EyeOutlined")}
          />

          {/* Tahrirlash */}
          <Button
            icon={<EditOutlined />}
            onClick={() => addTab("Tahrirlash", `/products/edit/${record.id}`, "EditOutlined")}
          />

          {/* O‘chirish */}
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

  return (
    <div>
      {/* Tepada btn */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => addTab("Mahsulot qo‘shish", "/products/new", "PlusOutlined")}
        style={{ marginBottom: 16 }}
      >
        Mahsulot qo‘shish
      </Button>

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
    </div>
  );
};

export default Products;
