import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register/register";
import Login from "../pages/Login/Login";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // {
  //   path: "/",
  //   element: <AppLayout />,
  //   children: [
  //     { index: true, element: <Dashboard /> },
  //     { path: "products", element: <Products /> },
  //     { path: "stats", element: <Stats /> },
  //   ],
  // },
]);
