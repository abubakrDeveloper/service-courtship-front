import { DesktopOutlined, FileOutlined, MoneyCollectOutlined, OrderedListOutlined, PieChartOutlined, SettingOutlined, TeamOutlined, UserOutlined,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import './Home.scss'
import { useInfoContext } from "../../context/infoContext";


const Home = () => {
    const { exit, currentUser, tabs, activeKey, setActiveKey, addTab, removeTab } = useInfoContext();
    let homeItems = [
      { label: "Hisobotlar", icon: <FileOutlined />, path: "/reports" },
      { label: "Tovarlar", icon: <OrderedListOutlined />, path: "/products" },
      { label: "Inventarizatsiya", icon: <PieChartOutlined />, path: "/inventory" },
      { label: "Ishlab chiqarish", icon: <DesktopOutlined />, path: "/production" },
      { label: "Moliya", icon: <MoneyCollectOutlined />, path: "/finance" },
      { label: "Xodimlar", icon: <TeamOutlined />, path: "/employees" },
    //   { label: "Mijozlar", icon: <UserOutlined />, path: "/customers" },
      { label: "Sozlamalar", icon: <SettingOutlined />, path: "/settings" },
    ];
    
    if (currentUser?.role !== "ADMIN") {
        homeItems = homeItems.filter(
          (item) => item.path !== "/products" && item.path !== "/settings" && item.path !== "/finance"
        );
      }
  return (
    <main>
        <div className="container">
            <div className="grid grid-cols-5 gap-4 p-6">
                {homeItems.map((item, index) => (
                <div
                    key={index}
                    onClick={() => addTab(item.label, item.path)}
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
        </div>
    </main>
  )
}

export default Home