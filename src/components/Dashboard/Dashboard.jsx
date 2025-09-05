import React, { useState } from "react";
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
  const { exit, currentUser, tabs, activeKey, setActiveKey, addTab, removeTab } =
    useInfoContext();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

<<<<<<< HEAD
  const items = [
    { key: "/", icon: <HomeOutlined />, label: "Bosh sahifa", onClick: () => addTab("Bosh sahifa", "/") },
    { key: "hisobotlar", icon: <FileOutlined />, label: "Hisobotlar", onClick: () => addTab("Hisobotlar", "/reports") },
    { key: "tovarlar", icon: <OrderedListOutlined />, label: "Tovarlar", onClick: () => addTab("Tovarlar", "/products") },
    { key: "inventarizatsiya", icon: <PieChartOutlined />, label: "Inventarizatsiya", onClick: () => addTab("Inventarizatsiya", "/inventory") },
    { key: "ishlab-chiqarish", icon: <DesktopOutlined />, label: "Ishlab chiqarish", onClick: () => addTab("Ishlab chiqarish", "/production") },
    { key: "moliya", icon: <MoneyCollectOutlined />, label: "Moliya", onClick: () => addTab("Moliya", "/finance") },
    { key: "xodimlar", icon: <TeamOutlined />, label: "Xodimlar", onClick: () => addTab("Xodimlar", "/employees") },
    // { key: "mijozlar", icon: <UserOutlined />, label: "Mijozlar", onClick: () => addTab("Mijozlar", "/customers") },
    { key: "sozlamalar", icon: <SettingOutlined />, label: "Sozlamalar", onClick: () => addTab("Sozlamalar", "/settings") },
    {
      key: "exit",
      icon: <LogoutOutlined />,
      label: "Exit",
=======
  // Menyu elementlarini rollar bilan
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Bosh sahifa",
      roles: ["admin", "manager", "seller"],
      onClick: () => addTab("Bosh sahifa", "/", "HomeOutlined"),
    },
    {
      key: "reports",
      icon: <FileOutlined />,
      label: "Hisobotlar",
      roles: ["admin", "manager"],
      onClick: () => addTab("Hisobotlar", "/reports", "FileOutlined"),
    },
    {
      key: "products",
      icon: <OrderedListOutlined />,
      label: "Tovarlar",
      roles: ["admin", "seller"],
      onClick: () => addTab("Tovarlar", "/products", "OrderedListOutlined"),
    },
    {
      key: "inventory",
      icon: <PieChartOutlined />,
      label: "Inventarizatsiya",
      roles: ["admin", "manager"],
      onClick: () => addTab("Inventarizatsiya", "/inventory", "PieChartOutlined"),
    },
    {
      key: "production",
      icon: <DesktopOutlined />,
      label: "Ishlab chiqarish",
      roles: ["admin", "manager"],
      onClick: () => addTab("Ishlab chiqarish", "/production", "DesktopOutlined"),
    },
    {
      key: "finance",
      icon: <MoneyCollectOutlined />,
      label: "Moliya",
      roles: ["admin"],
      onClick: () => addTab("Moliya", "/finance", "MoneyCollectOutlined"),
    },
    {
      key: "employees",
      icon: <TeamOutlined />,
      label: "Xodimlar",
      roles: ["admin", "manager"],
      onClick: () => addTab("Xodimlar", "/employees", "TeamOutlined"),
    },
    // {
    //   key: "customers",
    //   icon: <UserOutlined />,
    //   label: "Mijozlar",
    //   roles: ["admin", "manager", "seller"],
    //   onClick: () => addTab("Mijozlar", "/customers", "UserOutlined"),
    // },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Sozlamalar",
      roles: ["admin"],
      onClick: () => addTab("Sozlamalar", "/settings", "SettingOutlined"),
    },
    {
      key: "exit",
      icon: <LogoutOutlined />,
      label: "Chiqish",
      roles: ["admin", "manager", "seller"],
>>>>>>> d025ee7089eb7d1d51d00253a51ccc96bb382fe4
      onClick: exit,
      style: { color: "white", backgroundColor: "red" },
    },
  ];

<<<<<<< HEAD
  console.log(location.pathname);
  
=======
  // Foydalanuvchi roli asosida filter
  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(currentUser?.role)
  );
>>>>>>> d025ee7089eb7d1d51d00253a51ccc96bb382fe4

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="profile-box" style={{ padding: 16, textAlign: "center" }}>
          <Avatar
            size={64}
            src={currentUser?.url || "https://i.pravatar.cc/150?img=3"}
          />
          {!collapsed && (
            <h3 style={{ color: "white", marginTop: 8 }}>
              {currentUser?.phone}
            </h3>
          )}
        </div>
        <Menu theme="dark" mode="inline" items={allowedItems} />
      </Sider>

      <Layout>
        <Header style={{ padding: "0 16px", background: "#fff" }}>
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
              closable: tab.key !== "/dashboard",
            }))}
          />
        </Header>

        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
