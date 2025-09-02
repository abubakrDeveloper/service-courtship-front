import { DesktopOutlined, FileOutlined, MoneyCollectOutlined, OrderedListOutlined, PieChartOutlined, SettingOutlined, TeamOutlined, UserOutlined,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import './Home.scss'
import { useInfoContext } from "../../context/infoContext";

const Home = () => {
    const { exit, currentUser, tabs, activeKey, setActiveKey, addTab, removeTab } = useInfoContext();
  return (
    <main>
        <div className="container">
            <div className="home">
                <Link className="home_item" onClick={() => addTab("Hisobotlar", "/reports")}>
                    <i className='home_icon'><FileOutlined/></i>
                    <h2>Hisobotlar</h2>
                </Link>
                <Link className="home_item" onClick={() => addTab("Tovarlar", "/products")}>
                    <i className='home_icon'><OrderedListOutlined/></i>
                    <h2>Tovarlar</h2>
                </Link>
                <Link className="home_item" onClick={() => addTab("Inventarizatsiya", "/inventory")}>
                    <i className='home_icon'><PieChartOutlined/></i>
                    <h2>Inventarizatsiya</h2>
                </Link>
                <Link className="home_item" onClick={() => addTab("Ishlab chiqarish", "/production")}>
                    <i className='home_icon'><DesktopOutlined/></i>
                    <h2>Ishlab chiqarish</h2>
                </Link>
                <Link className="home_item" onClick={() => addTab("Moliya", "/finance")}>
                    <i className='home_icon'><MoneyCollectOutlined/></i>
                    <h2>Moliya</h2>
                </Link>
                <Link className="home_item" onClick={() => addTab("Xodimlar", "/employees")}>
                    <i className='home_icon'><TeamOutlined/></i>
                    <h2>Xodimlar</h2>
                </Link>
                {/* <Link className="home_item" onClick={() => addTab("Mijozlar", "/customers")}>
                    <i className='home_icon'><UserOutlined/></i>
                    <h2>Mijozlar</h2>
                </Link> */}
                <Link className="home_item" onClick={() => addTab("Sozlamalar", "/settings")}>
                    <i className='home_icon'><SettingOutlined /></i>
                    <h2>Sozlamalar</h2>
                </Link>
            </div>
        </div>
    </main>
  )
}

export default Home