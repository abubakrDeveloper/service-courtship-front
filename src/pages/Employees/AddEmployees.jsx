import { Form, Input, DatePicker, Button } from "antd";
import { useInfoContext } from "../../context/infoContext";
import { useState } from "react";
import axios from "axios";
import ImageUpload from "../../components/UI/ImageUpload";

const AddEmployees = () => {
    const { success } = useInfoContext();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    
        const handleSubmit = async (values) => {
        const formData = new FormData();

        // Inputlarni qo‘shish
        Object.entries(values).forEach(([key, value]) => {
        if (key === "startDate") {
            formData.append(key, value.format("YYYY-MM-DD"));
        } else {
            formData.append(key, value);
        }
        });

        // Rasmini qo‘shish
        if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
        }

        try {
        const res = await axios.post("/employeeinfo", formData)
        console.log(res);
        
        success("Xodim qo‘shildi!");
        form.resetFields();
        setFileList([]);
        } catch (err) {
        console.error(err);
        }
    };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="md:flex gap-6 items-center"
      >
        {/* Chap tomonda rasm yuklash */}
        <div className="flex justify-center items-center w-full md:w-1/3">
          <Form.Item label="Xodim rasmi" className="text-center">
            <ImageUpload imageStyle="circle" fileList={fileList} setFileList={setFileList} limit={1}/>
          </Form.Item>
        </div>
        {/* O‘ng tomonda inputlar */}
        <div className="w-full">
          <Form.Item
            name="firstname"
            label="Ism"
            rules={[{ required: true, message: "Ismni kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Familiya"
            rules={[{ required: true, message: "Familiyani kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: "Telefon raqamni kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Lavozim"
            rules={[{ required: true, message: "Lavozimni kiriting" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Maosh"
            rules={[{ required: true, message: "Maoshni kiriting" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Boshlagan sana"
            rules={[{ required: true, message: "Sanani tanlang" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Saqlash
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddEmployees;
