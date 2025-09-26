

import { Form, Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/authRequest";
import { useInfoContext } from "../../../context/infoContext";
import { useState } from "react";

export default function Login() {
  const {setCurrentUser, setToken, success, error} = useInfoContext()
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setSubmit(true)
    try {
      const {data} = await login(values)
      console.log(data);
      
      
      if (data) {
        // Tokenni localStorage'ga saqlash
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        setCurrentUser({
          ...data.user,
          role: data.role 
        });
        success(`Assalomu alaykum ${data.user.firstName}, tizimga muvaffaqiyatli kirdingiz!`);
        setSubmit(false)
        navigate("/");
      }
    } catch (err) {
      setSubmit(false)
      console.log(err);
      error(err?.response?.data?.message);
    }
  };

  return (
    <div style={{
      fontSize: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f2f5"
    }}>
      <Card title={false} style={{ width: 420 }}>
        <h2 style={{textAlign: 'center', fontSize: '20px', fontFamily: "sans-serif"}}>Login</h2>
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
            <Button type="primary" loading={submit} iconPosition="end" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
