// context/infoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getOneReq } from "../services/getRequeset";

const InfoContext = createContext(null);
export const useInfoContext = () => useContext(InfoContext);

export const InfoProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

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
  return navigate(path);
};

  const removeTab = (targetKey) => {
    let newTabs = tabs.filter((tab) => tab.key !== targetKey);
    if (newTabs.length === 0) {
      newTabs = [{ key: "/", label: "Bosh sahifa", path: "/", icon: 'HomeOutlined' }];
    }
    setTabs(newTabs);

    const lastTab = newTabs[newTabs.length - 1];
    setActiveKey(lastTab.key);
    return navigate(lastTab.path);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const success = (text) => messageApi.open({ type: "success", content: text });
  const error   = (text) => messageApi.open({ type: "error",   content: text });
  const warning = (text) => messageApi.open({ type: "warning", content: text });
  const loading = (text) => messageApi.open({ type: "loading", content: text });

  useEffect(() => {
    const getUser = async () => {
      
      try {
        const res = await getOneReq(userId, "auth/profile");
        setCurrentUser(res?.data);
      } catch (err) {
        if(err?.response?.data?.Data === "foydalanuvchi topilmadi" || err?.response?.data?.StatusCode == 404){
          exit()
        }
        if(err.message === "Network Error"){
          window.alert("Birozdan keyin qaytib urunib ko'ring")
        }
      }
    };
    if (userId && !currentUser) getUser();
  }, [userId]);

  const exit = () => {
    setActiveKey
    localStorage.clear();
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const value = {
    currentUser, setCurrentUser,
    exit, loader, setLoader, userId, setUserId,
    token, setToken, tabs, setTabs, activeKey, setActiveKey, addTab, removeTab,
    success, error, warning, loading,
  };

  return (
    <InfoContext.Provider value={value}>
      {contextHolder}
      {children}
    </InfoContext.Provider>
  );
};
