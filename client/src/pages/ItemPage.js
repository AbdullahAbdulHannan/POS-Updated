import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axios from "../utils/axiosConfig";
import {
  Modal,
  Button,
  Table,
  Form,
  Input,
  Select,
  Typography,
  Space,
  message,
} from "antd";
// import "./ItemPage.css"; // Custom styles

const { Title } = Typography;

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item deleted successfully!");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something went wrong.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img
          src={image}
          alt={record.name}
          height="50"
          width="50"
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleSubmit = async (value) => {
    if (!editItem) {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.post("/api/items/add-item", value);
        message.success("Item added successfully!");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something went wrong.");
      }
    } else {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item updated successfully!");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something went wrong.");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="item-page-header">
        <h1  className=" text-red-600">📦 Item Management</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setPopupModal(true)}
        >
          Add New Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={itemsData}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editItem ? "Edit Item" : "Add New Item"}
        open={popupModal}
        onCancel={() => {
          setEditItem(null);
          setPopupModal(false);
        }}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editItem || { category: "drinks" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Item name is required" }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input placeholder="Enter item price" type="number" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Image URL is required" }]}
          >
            <Input placeholder="Paste image URL" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select>
              <Select.Option value="drinks">Drinks</Select.Option>
              <Select.Option value="rice">Rice</Select.Option>
              <Select.Option value="noodles">Noodles</Select.Option>
            </Select>
          </Form.Item>

          <div className="form-actions">
            <Button htmlType="submit" type="primary" block>
              {editItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemPage;
