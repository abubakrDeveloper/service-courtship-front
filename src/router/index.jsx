import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register/register";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Header from "../components/Header/Header";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Header /> },
      // { path: "products", element: <Products /> },
      // { path: "stats", element: <Stats /> },
    ],
  },
]);
