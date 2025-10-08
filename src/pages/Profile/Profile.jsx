import { useEffect, useState } from "react";
import { LogoutOutlined, UserOutlined, BulbOutlined, SunOutlined, MoonOutlined, IdcardOutlined, EditOutlined,} from "@ant-design/icons";
import { Avatar, Card, Segmented, Button, Space, Typography, Image, Modal, Form, Input} from "antd";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useInfoContext } from "../../context/infoContext";
import ImageUpload from "../../components/UI/ImageUpload";
import { updateReq } from "../../services/putRequest";
import { deleteReq } from "../../services/deleteRequest";

const { Title, Text } = Typography;

const Profile = () => {
  const { theme, setTheme } = useTheme(); // theme emas, theme ni boshqarasiz
  const { t } = useLanguage();
  const { currentUser: user, setCurrentUser, exit, error, success} = useInfoContext();

  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const removeImage = async (path) => {
    const filename = path.split("/").pop();
    const data = await deleteReq(filename, 'files/delete')
    console.log("Rasm o'chirildi",data);
    setImageUrl("")
  }
  
  const handleFinish = async (values) => {
    try {
      setConfirmLoading(true);

      const updatedUser = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        image: imageUrl,
      };
      
      if (values.password) {
        updatedUser.password = values.password;
      }
      console.log(updatedUser);
      
      const res = await updateReq(user.id, updatedUser, 'admins')
      if(imageUrl && imageUrl !== ""){
        removeImage(user.image)
      }
      console.log(res);
      
      success("Profil muvaffaqiyatli yangilandi!");
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error(err);
      error("Xatolik yuz berdi!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleClose = () => {
    if(imageUrl && imageUrl !== ""){
      removeImage(imageUrl)
    }
    setOpen(false)
  }

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
          {user.image ? 
          <div className="profile_image flex items-center mx-auto" style={{borderRadius: "50%", overflow: 'hidden', width: "120px"}}>
            <Image
              width={120}
              src={`${import.meta.env.VITE_SERVER_URL}${user.image}`}
              /> 
          </div>
          : <Avatar
            size={120}
            style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
            icon={<UserOutlined style={{fontSize: 45}}/>}
          />}
        <Title level={4} className="mt-3">
          {user.lastName} {user.firstName}
        </Title>
        <Text type="secondary">{t(`${user.role}`)}</Text>
        <br />
        {user.phone && <a href={`tel:${user.phone}`}>{user.phone}</a>}
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
              <Text strong>Ilova rejimi</Text>
            </Space>
            <Segmented
              options={themes.map((th) => ({
                label: (
                  <span>
                    {th.icon} {th.label === "dark" ? "Tungi" : "Kunduzgi"}
                  </span>
                ),
                value: th.value,
              }))}
              value={theme}
              onChange={handleThemeChange}
            />
          </div>

          {/* Language */}
          <div className="flex justify-between items-center">
            <Space>
              <IdcardOutlined />
              <Text strong>Ma'lumotni o'zgartirish</Text>
            </Space>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              size="middle"
              onClick={() => setOpen(true)}
              className="rounded-xl"/>
          </div>
        </Space>
      </Card>

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
        <Modal
          title="Ma'lumotni yangilash"
          open={open}
          centered
          confirmLoading={confirmLoading}
          onCancel={handleClose}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstName: user?.firstName,
              lastName: user?.lastName,
              phone: user?.phone,
            }}
            onFinish={handleFinish}
          >
           <div className="flex justify-center items-center w-full text-center">
            {/* {user.image && <img
              src={user.image}
            />} */}
            <Form.Item className="text-center" name="image">
              <ImageUpload
                imageStyle="circle"
                fileUrl={imageUrl}
                setFileUrl={setImageUrl}
                limit={1}
              />
            </Form.Item>
          </div>
            <Form.Item
              label="Ism"
              name="firstName"
              rules={[{ required: true, message: "Ismni kiriting!" }]}
            >
              <Input placeholder="Ismingiz" />
            </Form.Item>

            <Form.Item
              label="Familiya"
              name="lastName"
              rules={[{ required: true, message: "Familiyani kiriting!" }]}
            >
              <Input placeholder="Familiyangiz" />
            </Form.Item>

            <Form.Item label="Telefon raqam" name="phone" rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}>
              <Input placeholder="+998..." />
            </Form.Item>


            <Form.Item label="Yangi parol" name="password" hasFeedback>
              <Input.Password placeholder="Yangi parol (ixtiyoriy)" />
            </Form.Item>

            <Form.Item
              label="Parolni tasdiqlash"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Parollar mos emas!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Parolni tasdiqlang" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
                block
              >
                Saqlash
              </Button>
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default Profile;
