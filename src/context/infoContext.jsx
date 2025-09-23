// context/infoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const InfoContext = createContext(null);
export const useInfoContext = () => useContext(InfoContext);

const defaultUser = [ /* ... */ ];

// renamed seed data to avoid redeclaration
const seedFilials = [
  { id: 1, name: "Chilonzor", logo: "chilonzor.png", startedAt: "2023-01-01", magazinId: 1 },
  { id: 2, name: "Yunusobod", logo: "yunusobod.png", startedAt: "2024-02-15", magazinId: 1 }
];

const seedProducts = [
  { id: 1, productName: "Samsung A15", count: 50, takingPrice: 1500000, sellingPrice: 2000000, promotion: 5, filialId: 1, firmaId: 1, date: "2025-08-28" },
  { id: 2, productName: "Lenovo Laptop", count: 20, takingPrice: 5000000, sellingPrice: 6200000, promotion: 10, filialId: 2, firmaId: 2, date: "2025-08-29" }
];

const seedSales = [
  { id: 1, productName: "Samsung A15", count: 2, takingPrice: 1500000, sellingPrice: 2000000, promotion: 5, filialId: 1, firmaId: 1, date: "2025-09-01" }
];

export const InfoProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // initialize products state (optionally from seedProducts)
  const [products, setProducts] = useState(() => seedProducts); // yoki useState([]) istasangiz
  const [dataCategory, setDataCategory] = useState([]);
  const [dataBlog, setDataBlog] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [about, setAbout] = useState(null);

  const [tabs, setTabs] = useState(() => {
    const savedTabs = localStorage.getItem("tabs");
    return savedTabs
      ? JSON.parse(savedTabs)
      : [{ key: "/", label: "Bosh sahifa", path: "/", icon: 'HomeOutlined' }];
  });

  const [activeKey, setActiveKey] = useState(() => localStorage.getItem("activeKey") || "/");

  useEffect(() => { localStorage.setItem("tabs", JSON.stringify(tabs)); }, [tabs]);
  useEffect(() => { localStorage.setItem("activeKey", activeKey); }, [activeKey]);

  const addTab = (label, path, icon) => {
    if (!tabs.find((tab) => tab.key === path)) {
      setTabs([...tabs, { key: path, label, path, icon }]);
    }
    setActiveKey(path);
    navigate(path);
  };

  const removeTab = (targetKey) => {
    let newTabs = tabs.filter((tab) => tab.key !== targetKey);
    if (newTabs.length === 0) {
      newTabs = [{ key: "/", label: "Bosh sahifa", path: "/", icon: 'HomeOutlined' }];
    }
    setTabs(newTabs);
    const lastTab = newTabs[newTabs.length - 1];
    setActiveKey(lastTab.key);
    navigate(lastTab.path);
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = (text) => messageApi.open({ type: "success", content: text });
  const error   = (text) => messageApi.open({ type: "error",   content: text });
  const warning = (text) => messageApi.open({ type: "warning", content: text });
  const openLoading = (text) => messageApi.open({ type: "loading", content: text });

  useEffect(() => {
    if (!userId) { setCurrentUser(null); return; }
    const user = defaultUser.find(u => String(u.id) === String(userId));
    setCurrentUser(user || null);
  }, [userId]);

  const exit = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    setUserId(null);
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const value = {
    currentUser, setCurrentUser,
    exit, userId, setUserId,
    products, setProducts,
    about, setAbout, defaultUser,
    loader, setLoader,
    filials: seedFilials,
    sales: seedSales,
    dataCategory, dataBlog, setDataCategory, setDataBlog,
    reviews, setReviews,
    tabs, setTabs, activeKey, setActiveKey, addTab, removeTab,
    success, error, warning, openLoading,
  };

  return (
    <InfoContext.Provider value={value}>
      {contextHolder}
      {children}
    </InfoContext.Provider>
  );
};
