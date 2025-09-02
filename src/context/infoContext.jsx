// context/infoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const InfoContext = createContext(null);
export const useInfoContext = () => useContext(InfoContext);

const defaultUser = [
  {
    _id: "999881241244",
    firstname: "Miraziz",
    lastname: "Ravshanov",
    phoneNumber: "+998934905134",
    password: "1234",
    token: "xxx",
    url: "https://cdn.pixabay.com/photo/2019/10/19/03/50/bmw-4560531_960_720.jpg",
  },
  {
    _id: "999885756377",
    firstname: "Abubakr",
    lastname: "Rashidov",
    phoneNumber: "+998999114755",
    password: "1234",
    token: "yyy",
    
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01TSCeWXMnbEeCluyGi669GhMkeS9l--5TAEh0TtXlUD_FkgCvvYkUgCLTYSlU4s7cOc&usqp=CAU",
  },
];

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
      : [{ key: "/", label: "Bosh sahifa", path: "/" }];
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

  const addTab = (label, path) => {
    if (!tabs.find((tab) => tab.key === path)) {
      setTabs([...tabs, { key: path, label, path }]);
    }
    setActiveKey(path);
    navigate(path);
  };

  const removeTab = (targetKey) => {
    let newTabs = tabs.filter((tab) => tab.key !== targetKey);
    if (newTabs.length === 0) {
      newTabs = [{ key: "/", label: "Bosh sahifa", path: "/" }];
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
    const user = defaultUser.find(u => String(u._id) === String(userId));
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
