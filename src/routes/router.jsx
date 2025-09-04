import { createBrowserRouter, Outlet } from "react-router-dom";
import { InfoProvider } from "../context/infoContext";

import Login from "../pages/Login/Login";
import Register from "../pages/register/register";
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
import ProtectedRoute from "./ProtectedRoute";

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
          { path: "reports", element: <Reports /> },
          { path: "products", element: <Products /> },
          { path: "inventory", element: <Inventory /> },
          { path: "production", element: <Production /> },
          { path: "finance", element: <Finance /> },
          { path: "employees", element: <Employees /> },
          { path: "customers", element: <Customers /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
