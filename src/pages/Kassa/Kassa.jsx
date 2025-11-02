import React, { useState, useEffect } from "react";
import { Splitter, Input, Button, Table, message, Modal } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  BarcodeOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  FileAddOutlined,
  CarryOutOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { SlCreditCard, SlActionUndo } from "react-icons/sl";
import { BsBoxArrowRight } from "react-icons/bs";
import { BiLogoPaypal } from "react-icons/bi";
import { CiMoneyBill } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useKassaStore } from "../../store/useKassaStore";
import { useInfoContext } from "../../context/infoContext";
import { getReq } from "../../services/getRequeset";
import { addReq } from "../../services/addRequest";

export default function Kassa() {
    const { currentUser, error, success, warning } = useInfoContext()
  const navigate = useNavigate();
  const {
    kassaId,
    setKassaId,
    cart,
    addToCart,
    decreaseQuantity,
    deleteFromCart,
    total,
    clearCart,
    addDelayedCustomer,
    delayedCustomers,
    restoreCustomer,
  } = useKassaStore();
  const [filters, setFilters] = useState({
    productName: "",
    filialId: currentUser.filialId || "",
    Qrcode: "",
    categoryId: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  

   useEffect(() => {
        if (!kassaId) {
            const currentKassa = localStorage.getItem('activeShift'); // yoki backenddan keladi
            setKassaId(currentKassa);
        }
    }, []);

  const fetchProducts = async ({ page, limit }) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...(filters.productName && { productName: filters.productName }),
        ...(filters.filialId && { filialId: filters.filialId }),
        ...(filters.Qrcode && { Qrcode: filters.Qrcode }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        page,
        limit,
      });  

      const {data} = await getReq(`products?${params.toString()}`); 
        console.log(data );
        
      setData(data.data);
      setPagination({
        current: data.page,
        pageSize: data.limit,
        total: data.total,
      });
    } catch (err) {
      console.error("Tavarlarni olishda xatolik:", err);
      error("Ma’lumotlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchProducts({ page: 1, limit: pagination.pageSize });
  }, [filters]);

  const handleReturn = () => {
    Modal.confirm({
      title: "Barcha savdoni bekor qilaymi?",
      onOk: () => {
        clearCart();
        message.warning("Barcha tovarlar bekor qilindi!");
      },
    });
  };

  const handleDelay = () => {
    addDelayedCustomer();
    message.info("Mijoz kechiktirildi va navbatga qo‘shildi!");
  };

  const handleSell = async () => {
    if (cart.length === 0) return message.error("Savatcha bo‘sh!");
    try {
      for (const item of cart) {
        await addReq({
            priceTag: 5000,
            sellingPrice: Number(item.sellingPrice),
            arrivalPrice: 4500,
            price: 6000,
            productName: item.productName,
            amount: item.quantity,
            total: Number(item.sellingPrice) * item.quantity,
            KassaId: Number(kassaId),
        }, "kassa-kirim");
      }
      message.success("Savdo muvaffaqiyatli amalga oshirildi!");
      clearCart();
    } catch (err) {
      console.error(err);
      message.error("Savdo amalga oshmadi!");
    }
  };
  
  console.log(cart);
  
  const handleReport = async () => {
    try {
      localStorage.removeItem('activeShift')
      navigate("/shift");
    } catch (err) {
      console.error(err);
      message.error("Hisobot yuborishda xatolik!");
    }
  };

  const columnsLeft = [
    {
      title: "Rasmi",
      dataIndex: "image",
      render: (image) => (
        image ? (
          <img
            src={`${import.meta.env.VITE_SERVER_URL}${image}`}
            alt="Tavar rasmi"
            style={{ width: 60, height: 50, objectFit: "contain", borderRadius: 8 }}
          />
        ) : (
          <Avatar size={45} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          shape="square" 
          icon={<ShopOutlined />} />
        )
      ),
    },
    { title: "Tovar", dataIndex: "productName" },
    { title: "Narx", dataIndex: "sellingPrice" },
    { title: `QR kodi`, dataIndex: "Qrcode" },
    {
      title: "Qo‘shish",
      render: (_, r) => (
        <div>
            <Button type="link" icon={<PlusOutlined />} onClick={() => addToCart(r)} />
            <Button type="button" icon={<StarOutlined />} onClick={() => addToCart(r)} />
        </div>
      ),
    },
  ];
  
  const columnsRight = [
    { title: "Tovar", dataIndex: "productName" },
    { title: "Soni", dataIndex: "quantity" },
    {
      title: "Jami",
      render: (_, r) => (Number(r.sellingPrice) * r.quantity).toLocaleString(),
    },
    {
      title: "Harakat",
      render: (_, r) => (
        <>
          <Button
            size="small"
            onClick={() => addToCart(r)}
            icon={<PlusOutlined />}
          />
          <Button
            size="small"
            onClick={() => decreaseQuantity(r.id)}
            icon={<DeleteOutlined />}
            className="ml-2"
          />
        </>
      ),
    },
    {
      title: "O‘chirish",
      render: (_, r) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => deleteFromCart(r.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ height: "100%" }}>
        <Splitter>
        <Splitter.Panel defaultSize="50%">
            <div className="p-4 h-full">
                <div className="flex items-center justify-between pb-3">
                    <h2 className="text-lg font-semibold"><FileAddOutlined /> Mahsulotlar</h2>
                    <Button
                        danger
                        icon={<BsBoxArrowRight />}
                        style={{ float: "right" }}
                        onClick={handleReport}
                    >
                        Kassani yopish
                    </Button>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Input
                        placeholder="Tovar nomini yozing..."
                        value={filters.productName}
                        onChange={(e) => setFilters({productName: e.target.value})}
                        prefix={<SearchOutlined />}
                    />
                    <Input
                        placeholder="QR bo'yicha"
                        value={filters.Qrcode}
                        onChange={(e) => setFilters({Qrcode: e.target.value})}
                        prefix={<BarcodeOutlined />}
                    />
                </div>
                <Table
                    className="mt-3"
                    dataSource={data}
                    columns={columnsLeft}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
                
            </div>
        </Splitter.Panel>

        <Splitter.Panel>
            <Splitter layout="vertical">
                <Splitter.Panel>
                    <div className="p-4 relative h-full">
                        <h2 className="text-lg font-semibold mb-3"><ShoppingCartOutlined /> Savat</h2>
                        <Table
                            dataSource={cart}
                            columns={columnsRight}
                            rowKey="id"
                            pagination={false}
                        />
                        <h3 style={{zIndex: 9999}} className="text-xl text-nowrap text-end font-bold mb-2 absolute end-0 bottom-0">
                            Umumiy summa: <span className="text-blue-500">{total || "0"} so‘m</span>
                        </h3>
                    </div>
                </Splitter.Panel>

                <Splitter.Panel defaultSize="36%">
                    <div style={{scrollbarWidth: 'none'}} className="p-4">
                        <div style={{scrollbarWidth: 'none'}} className="flex items-center overflow-auto w-full gap-2 mb-2">
                            {delayedCustomers.length > 0 && 
                                delayedCustomers.map((d) => (
                                    <Button
                                    key={d.id}
                                    onClick={() => restoreCustomer(d.id)}
                                    >
                                    ⏳ {d.createdAt} dagi mijoz
                                    </Button>
                                ))
                            }
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="primary" color="cyan" variant="solid" className="w-3xs ml-2 mt-2 text-lg h-15" icon={<CarryOutOutlined />} onClick={handleSell}>
                            Sotildi
                            </Button>
                            <Button color="cyan" variant="solid" className="w-3xs ml-2 text-lg mt-2 h-15" icon={<SlActionUndo />} onClick={handleReturn}>
                            Bekor qilish
                            </Button>
                            <Button color="cyan" variant="solid" className="w-3xs ml-2 text-lg mt-2 h-15" icon={<CiMoneyBill />}>Naqd</Button>
                            <Button color="cyan" variant="solid" className="w-3xs ml-2 text-lg mt-2 h-15" icon={<SlCreditCard />}>Karta</Button>
                            <Button color="cyan" variant="solid" className="w-3xs ml-2 text-lg mt-2 h-15" icon={<BiLogoPaypal />}>Boshqa tizim</Button>
                            <Button color="cyan" variant="solid" className="w-3xs ml-2 text-lg mt-2 h-15" icon={<AppstoreAddOutlined />} onClick={handleDelay}>
                            Kechiktirish
                            </Button>
                        </div>
                    </div>
                </Splitter.Panel>
            </Splitter>
        </Splitter.Panel>
        </Splitter>
    </div>
  );
}
