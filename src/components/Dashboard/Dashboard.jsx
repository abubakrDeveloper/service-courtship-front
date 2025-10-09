import { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Tabs, Button, Image } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useInfoContext } from "../../context/infoContext";
import "./Dashboard.scss";

import * as Icons from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

const { Header, Content, Sider } = Layout;

const renderIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent /> : null;
};

const Dashboard = () => {
  const { exit, currentUser, tabs, activeKey, setActiveKey, addTab, removeTab, setTabs } = useInfoContext();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Menyu elementlarini rollar bilan
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Bosh sahifa",
      roles: ["ADMIN", "MANAGER", "SELLER"],
      onClick: () => addTab("Bosh sahifa", "/", "HomeOutlined"),
    },
    {
      key: "reports",
      icon: <FileOutlined />,
      label: "Hisobotlar",
      roles: ["ADMIN", "MANAGER"],
      onClick: () => addTab("Hisobotlar", "/reports", "FileOutlined"),
    },
    {
      key: "products",
      icon: <OrderedListOutlined />,
      label: "Tovarlar",
      roles: ["MANAGER", "SELLER"],
      onClick: () => addTab("Tovarlar", "/products", "OrderedListOutlined"),
    },
    {
      key: "inventory",
      icon: <PieChartOutlined />,
      label: "Inventarizatsiya",
      roles: ["ADMIN", "MANAGER"],
      onClick: () => addTab("Inventarizatsiya", "/inventory", "PieChartOutlined"),
    },
    {
      key: "production",
      icon: <DesktopOutlined />,
      label: "Ishlab chiqarish",
      roles: ["ADMIN", "MANAGER"],
      onClick: () => addTab("Ishlab chiqarish", "/production", "DesktopOutlined"),
    },
    {
      key: "finance",
      icon: <MoneyCollectOutlined />,
      label: "Moliya",
      roles: ["MANAGER"],
      onClick: () => addTab("Moliya", "/finance", "MoneyCollectOutlined"),
    },
    {
      key: "employees",
      icon: <TeamOutlined />,
      label: "Xodimlar",
      roles: ["ADMIN", "MANAGER"],
      onClick: () => addTab("Xodimlar", "/employees", "TeamOutlined"),
    },
    // {
    //   key: "customers",
    //   icon: <UserOutlined />,
    //   label: "Mijozlar",
    //   roles: ["ADMIN", "MANAGER", "SELLER"],
    //   onClick: () => addTab("Mijozlar", "/customers", "UserOutlined"),
    // },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Sozlamalar",
      roles: ["MANAGER"],
      onClick: () => addTab("Sozlamalar", "/settings", "SettingOutlined"),
    }
  ];

  // Foydalanuvchi roli asosida filter
  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(currentUser?.role)
  );

  return (
    <Layout style={{ height: "100vh"}}>
      <Sider 
        className="menu_slider"
        theme={theme === "dark" ? "dark" : "light"}
        collapsible={window.innerWidth >= 500}
        collapsed={window.innerWidth <= 500 || collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="profile-box" style={{ padding: 16, textAlign: "center", cursor: 'pointer', height: window.innerWidth >= 500 ? "120px" : "85px"}} onClick={() => addTab("Profile", "/profile", "UserOutlined")}>
            {currentUser.image ? 
              <div className="profile_image flex items-center justify-center mx-auto" style={{borderRadius: "50%", overflow: 'hidden', maxWidth: "88px", maxHeight: '88px'}}>
                <Image
                  preview={false}
                  style={{width: '100%', objectFit: 'contain'}}
                  src={`${import.meta.env.VITE_SERVER_URL}${currentUser.image}`}
                  /> 
              </div>
              : <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                shape="circle" className={`${(window.innerWidth <= 500 || collapsed) ? "size-10" : " size-20"}`} 
                icon={<UserOutlined style={(window.innerWidth <= 500 || collapsed) ? {} : {fontSize: "30px"}}/>} />
              }
        </div>
        <Menu
          theme={theme === "dark" ? "dark" : "light"}
          mode="inline"
          style={{ display: "flex", flexDirection: "column", height: "92%", position: 'relative' }}
          items={[
            // Rol asosida filterlangan itemlar
            ...allowedItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              onClick: item.onClick,
            })),

            // Exit button doimo pastda
            {
              key: "exit",
              icon: <LogoutOutlined />,
              label: "Chiqish",
              onClick: exit,
            style: { position: "absolute", bottom: (window.innerWidth >= 500 && !collapsed) ? 50 : 10, left: 0 , color: "white", backgroundColor: "red" },
            },
          ]}
        />

      </Sider>


      <Layout>
        <Header
          style={{ padding: "20px 0 0 10px", background: "transparent"}}
        >
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key);
              navigate(key);
            }}
            onEdit={(targetKey, action) =>
              action === "remove" && removeTab(targetKey)
            }
            items={tabs.map((tab) => ({
              key: tab.key,
              label: (
                <div className="tab-label">
                  <span>{renderIcon(tab.icon)}</span>
                  <span className="hidden sm:block">{tab.label}</span>
                </div>
              ),
              closable: tab.key !== "/",
            }))}

            // Qo‘shimcha tugma
            tabBarExtraContent={{
              left: (
                <span
                  className="clear_btn"
                  onClick={() => {
                    setTabs([{ key: "/", label: "Bosh sahifa", path: "/", icon: "HomeOutlined" }]);
                    setActiveKey("/");
                    navigate("/");
                  }}
                >
                  <Icons.ClearOutlined />
                </span>
              ),
            }}
          />

        </Header>

        <Content style={{
          padding: 24,
          margin: "10px",
          background: theme === "dark" ? "#0d1a26" : "#f5f5f5", // Layout’dan biroz farqli rang
          maxHeight: "92vh", overflowX: 'auto'
        }}>
            <Outlet />
        </Content>

        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Dashboard;
