

import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login/manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();

      // Tokenni localStorage'ga saqlash
      localStorage.setItem("token", data.accessToken);

      messageApi.success("Login muvaffaqiyatli!");
      console.log("Backend javobi:", data);

      // User paneliga yo'naltirish
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      messageApi.error("Login xatolik!");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f2f5"
    }}>
      {contextHolder}
      <Card title="Login" style={{ width: 420 }}>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Iltimos telefon raqamni kiriting" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Iltimos parolni kiriting" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
