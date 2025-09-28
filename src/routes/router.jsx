// router.jsx
import { createBrowserRouter, Outlet } from "react-router-dom";
import { InfoProvider } from "../context/infoContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ConfigProvider, theme as antdTheme } from "antd";

import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/register/register";
import Dashboard from "../components/Dashboard/Dashboard";

import Reports from "../pages/Reports/Reports";
import Products from "../pages/Products/Products";
import Inventory from "../pages/Inventory/Inventory";
import Production from "../pages/Production/Production";
import Finance from "../pages/Finance/Finance";
import Employees from "../pages/Employees/Employees";
import Customers from "../pages/Customers/Customers";
import Settings from "../pages/Settings/Settings";
import Home from "../pages/Home/Home";

import ProtectedRoute from "../layouts/ProtectedRoute";
import CreateProduct from "../pages/Products/CreateProduct";
import Profile from "../pages/Profile/Profile";
import AddEmployees from "../pages/Employees/AddEmployees";

// 🎨 ConfigProvider ThemeWrapper
const ThemeWrapper = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          colorBgContainer: theme === "dark" ? "#001529" : "#f5f5f5", // Layout umumiy fon
          colorBgLayout: theme === "dark" ? "#0d1a26" : "#fafafa",    // Content uchun alohida fon
        },
        components: {
          Layout: {
            siderBg: theme === "dark" ? "#001529" : "#fff",
            headerBg: theme === "dark" ? "#141414" : "#fff",
          },
        },
      }}
    >

      {children}
    </ConfigProvider>
  );
};

const AppProvidersLayout = () => (
  <InfoProvider>
    <ThemeProvider>
      <LanguageProvider>
        <ThemeWrapper>
          <Outlet />
        </ThemeWrapper>
      </LanguageProvider>
    </ThemeProvider>
  </InfoProvider>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppProvidersLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Home /> },
          {
            path: "reports",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <Reports />
              </ProtectedRoute>
            ),
          },
          {
            path: "products",
            element: (
              <ProtectedRoute roles={["ADMIN", "SELLER"]}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <Products /> },
              { path: ":id", element: <CreateProduct /> },
              { path: "new", element: <CreateProduct /> },
              { path: "edit/:id", element: <CreateProduct /> },
            ],
          },
          {
            path: "inventory",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <Inventory />
              </ProtectedRoute>
            ),
          },
          {
            path: "production",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <Production />
              </ProtectedRoute>
            ),
          },
          {
            path: "finance",
            element: (
              <ProtectedRoute roles={["ADMIN"]}>
                <Finance />
              </ProtectedRoute>
            ),
          },
          {
            path: "employees",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <Employees /> },
              { path: "new", element: <AddEmployees /> },
            ],
          },
          {
            path: "customers",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER", "SELLER"]}>
                <Customers />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute roles={["ADMIN"]}>
                <Settings />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute roles={["ADMIN", "MANAGER", "SELLER"]}>
                <Profile />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
