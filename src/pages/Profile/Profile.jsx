import { useEffect, useState } from "react";
import {
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
  BulbOutlined,
  SunOutlined,
  MoonOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Segmented,
  Select,
  Button,
  Space,
  Typography,
} from "antd";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useInfoContext } from "../../context/infoContext";

const { Title, Text } = Typography;

const Profile = () => {
  const { mode, setTheme } = useTheme(); // theme emas, theme ni boshqarasiz
  const { t } = useLanguage();
  const { currentUser: user, exit } = useInfoContext();
  const [lang, setLang] = useState(user.lang || "uz");

  useEffect(() => {
    setLang(user.lang || "uz");
    setTheme(user.mode || "light");
  }, [user]);

  const languages = [
    { value: "uz", label: "O‘zbekcha" },
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  const themes = [
    { label: t("light"), value: "light", icon: <SunOutlined className="text-amber-600" /> },
    { label: t("dark"), value: "dark", icon: <MoonOutlined className="text-blue-500" /> },
  ];

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* User card */}
      <Card className="rounded-2xl shadow-md text-center">
        <Avatar
          size={64}
          style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
          icon={<UserOutlined />}
        />
        <Title level={4} className="mt-3">
          {user.full_name}
        </Title>
        <Text type="secondary">{t(`${user.role}`)}</Text>
        <br />
        <a href={`tel:${user.phone}`}>{user.phone}</a>
      </Card>

      {/* Settings */}
      <Card className="mt-6 rounded-2xl shadow-md">
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%" }}
          className="w-full"
        >
          {/* Theme switcher */}
          <div className="flex justify-between items-center">
            <Space>
              <BulbOutlined />
              <Text strong>{t("dark_theme")}</Text>
            </Space>
            <Segmented
              options={themes.map((th) => ({
                label: (
                  <span>
                    {th.icon} {th.label}
                  </span>
                ),
                value: th.value,
              }))}
              value={mode}
              onChange={handleThemeChange}
            />
          </div>

          {/* Language */}
          <div className="flex justify-between items-center">
            <Space>
              <GlobalOutlined />
              <Text strong>{t("language")}</Text>
            </Space>
            <Select
              value={lang}
              options={languages}
              style={{ width: 140 }}
            />
          </div>
        </Space>
      </Card>

      {/* Logout */}
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        block
        size="large"
        className="mt-6 rounded-xl"
        onClick={() => {
          setTheme("light");
          exit();
          window.location.replace("/login");
        }}
      >
        {t("log_out")}
      </Button>
    </div>
  );
};

export default Profile;
