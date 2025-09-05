import { useState } from "react";
import { Button, Table, Modal, Input } from "antd";
import './Products.scss';

const mockProducts = [
  { id: 1, name: "Mahsulot 1", price: 100 },
  { id: 2, name: "Mahsulot 2", price: 200 },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const handleAdd = () => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "" });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Products</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        + Add Product
      </Button>

      <Table
        className="mt-4"
        rowKey="id"
        dataSource={products}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Price", dataIndex: "price" },
          {
            title: "Action",
            render: (_, record) => (
              <Button danger onClick={() => handleDelete(record.id)}>
                Delete
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Add Product"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Name"
          className="mb-2"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <Input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default Products;
