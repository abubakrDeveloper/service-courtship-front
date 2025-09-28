import {
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  FieldTimeOutlined,
  DatabaseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Reports.scss";

const menuItems = [
  { label: "Boshqaruv paneli", icon: <DashboardOutlined />, path: "/reports/dashboard" },
  { label: "Kirim chiqim dashboardi", icon: <BarChartOutlined />, path: "/reports/income-expense" },
  { label: "Cheklar", icon: <FileTextOutlined />, path: "/reports/checks" },
  { label: "Sotish", icon: <AppstoreOutlined />, path: "/reports/sales" },
  { label: "Smena", icon: <FieldTimeOutlined />, path: "/reports/shifts" },
  { label: "Inventarizatsiyani baholash", icon: <DatabaseOutlined />, path: "/reports/inventory" },
  { label: "Tovar bo‘yicha sotuv", icon: <DatabaseOutlined />, path: "/reports/by-product" },
  { label: "Kategoriyalar bo‘yicha sotuvlar", icon: <DatabaseOutlined />, path: "/reports/by-category" },
  { label: "Omborlar bo‘yicha zaxira", icon: <DatabaseOutlined />, path: "/reports/by-warehouse" },
  { label: "Sotuvchilar hisobot", icon: <DatabaseOutlined />, path: "/reports/sellers" },
  { label: "Xodimlar bo‘yicha hisobotlar", icon: <DatabaseOutlined />, path: "/reports/employees" },
];

const Reports = () => {
  const navigate = useNavigate();

  return (
  <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:p-6">
    {menuItems.map((item, index) => (
      <div
        key={index}
        onClick={() => navigate(item.path)}
        className="
          flex flex-col items-center justify-center
          rounded-xl cursor-pointer p-6
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          text-white shadow-md hover:shadow-xl
          hover:scale-105 transition-transform duration-200 bg-red-500
        "
      >
        <div className="text-4xl mb-2">{item.icon}</div>
        <span className="text-sm font-medium text-center">
          {item.label}
        </span>
      </div>
    ))}
  </div>
  );
};

export default Reports;
