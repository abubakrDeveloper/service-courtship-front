import { createBrowserRouter, Outlet } from "react-router-dom";
import { InfoProvider } from "../context/infoContext";

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

const AppProvidersLayout = () => (
  <InfoProvider>
    <Outlet />
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
              <ProtectedRoute roles={["admin", "manager"]}>
                <Reports />
              </ProtectedRoute>
            ),
          },
          {
            path: "products",
            element: (
              <ProtectedRoute roles={["admin", "seller"]}>
                <Outlet /> {/* Bu joyga children lar tushadi */}
              </ProtectedRoute>
            ),
            children: [
              {
                index: true, // /products
                element: <Products />,
              },
              {
                path: "new", // /products/new
                element: <CreateProduct />,
              },
            ],
          },
          {
            path: "inventory",
            element: (
              <ProtectedRoute roles={["admin", "manager"]}>
                <Inventory />
              </ProtectedRoute>
            ),
          },
          {
            path: "production",
            element: (
              <ProtectedRoute roles={["admin", "manager"]}>
                <Production />
              </ProtectedRoute>
            ),
          },
          {
            path: "finance",
            element: (
              <ProtectedRoute roles={["admin"]}>
                <Finance />
              </ProtectedRoute>
            ),
          },
          {
            path: "employees",
            element: (
              <ProtectedRoute roles={["admin", "manager"]}>
                <Employees />
              </ProtectedRoute>
            ),
          },
          {
            path: "customers",
            element: (
              <ProtectedRoute roles={["admin", "manager", "seller"]}>
                <Customers />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute roles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
