import { Form, Input, Select, Checkbox, Button, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const CreateProduct = () => {
    const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item name="name" label="Nomi" rules={[{ required: true, message: "Nomini kiriting" }]}>
          <Input placeholder="Mahsulot nomi" />
        </Form.Item>

        <Form.Item name="category" label="Kategoriya" rules={[{ required: true, message: "Kategoriya tanlang" }]}>
          <Select placeholder="Tanlang" />
        </Form.Item>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item name="available" valuePropName="checked">
          <Checkbox>Sotuvda mavjud</Checkbox>
        </Form.Item>

        <Form.Item name="inStock" valuePropName="checked">
          <Checkbox>Mavjud zaxirasi</Checkbox>
        </Form.Item>

        <Form.Item name="semiProduct" valuePropName="checked">
          <Checkbox>Yarim tayyor mahsulot</Checkbox>
        </Form.Item>

        <Form.Item name="taxable" valuePropName="checked">
          <Checkbox>Soliq solingan</Checkbox>
        </Form.Item>

        <Form.Item name="batchProduct" valuePropName="checked">
          <Checkbox>Partiyali tovar</Checkbox>
        </Form.Item>
      </div>

      <Form.Item name="parentProduct" label="Ona tovar">
        <Select placeholder="Tanlang" />
      </Form.Item>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item name="vendorCode" label="Vendor code">
          <Input />
        </Form.Item>

        <Form.Item name="unit" label="O‘B">
          <Select defaultValue="Dona">
            <Select.Option value="dona">Dona</Select.Option>
            <Select.Option value="kg">Kg</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item name="price" label="Narxi">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="currency" label="Valyuta">
          <Select defaultValue="UZS">
            <Select.Option value="UZS">UZS</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item name="barcode" label="Barkod">
          <Input />
        </Form.Item>

        <Form.Item name="mxik" label="MXIK">
          <Input />
        </Form.Item>
      </div>

      <Form.Item name="description" label="Izoh">
        <TextArea rows={3} />
      </Form.Item>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <Form.Item name="weight" label="Kilogram">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="volume" label="Hajmi">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="brand" label="Brend">
          <Input />
        </Form.Item>
      </div>

      <Form.Item name="image" label="Rasm">
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>Yuklash</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Yaratish
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateProduct