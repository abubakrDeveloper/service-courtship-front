// context/infoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InfoContext = createContext(null);
export const useInfoContext = () => useContext(InfoContext);

export const InfoProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

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
    if (token && !currentUser) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        exit();
      }
    }
  }, [token]);


  const exit = () => {
    setActiveKey
    localStorage.clear();
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const value = {
    currentUser, setCurrentUser,
    exit, about, setAbout,
    loader, setLoader,
    token, setToken,
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
