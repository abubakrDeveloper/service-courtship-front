// context/infoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const InfoContext = createContext(null);
export const useInfoContext = () => useContext(InfoContext);

const defaultUser = [
  {
    id: "999881241244",
    firstName: "Miraziz",
    lastName: "Ravshanov",
    phone: "+998934905134",
    password: "1234",
    token: "xxx",
    role: "admin",
    url: "https://cdn.pixabay.com/photo/2019/10/19/03/50/bmw-4560531_960_720.jpg",
  },
  {
    id: "999885756377",
    firstName: "Abubakr",
    lastName: "Rashidov",
    phone: "+998999114755",
    password: "1234",
    token: "yyy",
    role: "manager",    
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01TSCeWXMnbEeCluyGi669GhMkeS9l--5TAEh0TtXlUD_FkgCvvYkUgCLTYSlU4s7cOc&usqp=CAU",
  },
  {
    id: "999881234577",
    firstName: "Jasur",
    lastName: "Toshpulatov",
    phone: "+998901112233",
    password: "1234",
    token: "www",
    role: "admin",
    filialId: 1,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lykan_HyperSport.jpg/960px-Lykan_HyperSport.jpg"
  },
  {
    id: "999885423677",
    firstName: "Dilshod",
    lastName: "Karimov",
    phone: "+998903334455",
    password: "1234",
    token: "zzz",
    role: "manager",
    filialId: 2,
    url: "https://static.vecteezy.com/system/resources/previews/023/977/547/non_2x/front-view-dark-silhouette-of-a-modern-luxury-black-car-isolated-on-black-background-ai-generated-free-photo.jpg"
  }
];

const  filials = [
  { "id": 1, "name": "Chilonzor", "logo": "chilonzor.png", "startedAt": "2023-01-01", "magazinId": 1 },
  { "id": 2, "name": "Yunusobod", "logo": "yunusobod.png", "startedAt": "2024-02-15", "magazinId": 1 }
];
const products = [
  { "id": 1, "productName": "Samsung A15", "count": 50, "takingPrice": 1500000, "sellingPrice": 2000000, "promotion": 5, "filialId": 1, "firmaId": 1, "date": "2025-08-28" },
  { "id": 2, "productName": "Lenovo Laptop", "count": 20, "takingPrice": 5000000, "sellingPrice": 6200000, "promotion": 10, "filialId": 2, "firmaId": 2, "date": "2025-08-29" }
];
const sales = [
  { "id": 1, "productName": "Samsung A15", "count": 2, "takingPrice": 1500000, "sellingPrice": 2000000, "promotion": 5, "filialId": 1, "firmaId": 1, "date": "2025-09-01" }
]

export const InfoProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const [products, setProducts] = useState([]);
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

  const [activeKey, setActiveKey] = useState(() => {
    return localStorage.getItem("activeKey") || "/";
  });

   useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("activeKey", activeKey);
  }, [activeKey]);

 const addTab = (label, path, icon) => {
  if (!tabs.find((tab) => tab.key === path)) {
    setTabs([...tabs, { key: path, label, path, icon }])
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
  const loading = (text) => messageApi.open({ type: "loading", content: text });

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
    loader, setLoader, filials, sales, products,
    dataCategory, dataBlog, setDataCategory, setDataBlog,
    reviews, setReviews, tabs, setTabs, activeKey, setActiveKey, addTab, removeTab,
    success, error, warning, loading,
  };

  return (
    <InfoContext.Provider value={value}>
      {contextHolder} {/* ← shu bo‘lmasa message ko‘rinmaydi */}
      {children}
    </InfoContext.Provider>
  );
};
