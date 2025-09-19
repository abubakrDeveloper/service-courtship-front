import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Vite env o'zgaruvchisi
  // const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
  const server_url = process.env.SERVER_URL;

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Form values:", values);

    try {
      const res = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        // serverdan kelgan xatolik xabarini ko'rsatamiz (agar bor bo'lsa)
        const errMsg = data?.message || `Server responded: ${res.status}`;
        message.error(errMsg);
        setLoading(false);
        return;
      }

      message.success("Ro'yxatdan o'tish muvaffaqiyatli! Iltimos login qiling.");
      // agar token qaytsa va uni saqlash kerak bo'lsa shu yerda saqlang
      // localStorage.setItem('token', data.accessToken);

      navigate("/login");
    } catch (err) {
      console.error(err);
      message.error("Tarmoq xatosi. Iltimos internetni tekshirib qayta urinib ko'ring.");
      setLoading(false);
    } finally {
      setLoading(false);
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
      <Card title="Register" style={{ width: 400 }}>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please input your last name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\+?\d{9,15}$/, message: "Noto'g'ri telefon format (misol: +998901234567)" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Parol kamida 6 ta belgidan bo'lishi kerak" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="link" onClick={() => navigate("/login")} block>
              Already have an account? Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
