import { useState } from "react";
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
import { Avatar, Layout, Menu, Tabs } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useInfoContext } from "../../context/infoContext";
import "./Dashboard.scss";

import * as Icons from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const renderIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent /> : null;
};

const Dashboard = () => {
  const { exit, currentUser, tabs, activeKey, setActiveKey, addTab, removeTab } = useInfoContext();
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
      roles: ["ADMIN", "SELLER"],
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
      roles: ["ADMIN"],
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
      roles: ["ADMIN"],
      onClick: () => addTab("Sozlamalar", "/settings", "SettingOutlined"),
    }
  ];

  // Foydalanuvchi roli asosida filter
  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(currentUser?.role)
  );

  return (
    <Layout style={{ height: "94vh"}}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="profile-box" style={{ padding: 16, textAlign: "center" }}>
          <Avatar
            size={64}
            src={currentUser?.url || "https://i.pravatar.cc/150?img=3"}
          />
        </div>
        <Menu
          mode="inline"
          style={{ display: "flex", flexDirection: "column", height: "100%", position: 'relative' }}
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
              style: { position: "absolute", bottom: 44, left: 0 , color: "white", backgroundColor: "red" },
            },
          ]}
        />

      </Sider>


      <Layout>
        <Header style={{ padding: "16px", background: "#fff" }}>
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
                <span className="tab-label">
                  {renderIcon(tab.icon)} {tab.label}
                </span>
              ),
              closable: tab.key !== "/",
            }))}
          />
        </Header>

        <Content style={{ margin: "16px"}}>
          <div style={{ padding: 24, maxHeight: "88vh", overflowX: 'auto', background: "#fff" }}>
            <Outlet />
          </div>
        </Content>

        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Dashboard;
