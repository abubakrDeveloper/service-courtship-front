import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useInfoContext } from "../../context/infoContext";

export default function Login() {
  const {success, error, setCurrentUser, setUserId, contextHolder, defaultUser} = useInfoContext()
  const navigate = useNavigate();
 

  const onFinish = (values) => {

    const foundUser = defaultUser.find(
      (user) =>
        user.phone === values.phone &&
        user.password === values.password
    );

    if (foundUser) {
      localStorage.setItem("userId", foundUser.id);
      localStorage.setItem("access_token", foundUser.token);
      setCurrentUser(foundUser)
      setUserId(foundUser.id)
      navigate("/");
    } else {
      error("Telefon raqam yoki parol xato!");
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
      <Card title="Login" style={{ width: 400 }}>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
        > 
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="link" onClick={() => navigate("/register")} block>
              Already have an account? Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
