import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "../utils/axiosConfig";

const CreateUserForm = () => {
  const [form] = Form.useForm();
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch user count for this admin (mocked for now, replace with API call if available)
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const token = auth.token;
        // Replace with real API call to get user count for this admin
        // const res = await axios.get("/api/admin/users/count", { headers: { Authorization: `Bearer ${token}` } });
        // setUserCount(res.data.count);
        
        setUserCount(2); // mock: change to 4 to test limit
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchUserCount();
  }, []);

  const handleFinish = async (values) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = auth.token;
      const res = await axios.post(
        "/api/admin/create-user",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(res.data?.message || "User created successfully!");
      form.resetFields();
      setUserCount((prev) => prev + 1);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to create user. User ID and Email must be unique."
      );
    }
  };

  const isLimitReached = userCount >= 4;

  return (
    <Card className="max-w-lg mx-auto shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New User</h2>
      {isLimitReached && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          User limit reached. You can only create up to 4 users.
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
        disabled={isLimitReached || loading}
      >
        <Form.Item
          name="userId"
          label="User ID"
          rules={[{ required: true, message: "Please enter a User ID" }]}
        >
          <Input placeholder="Enter user ID" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="number"
          label="Number"
          rules={[{ required: true, message: "Please enter a number" }]}
        >
          <Input placeholder="Enter number" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter a password" }, { min: 6, message: "Password must be at least 6 characters" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="shopId"
          label="Shop ID"
          rules={[{ required: true, message: "Please enter a Shop ID" }]}
        >
          <Input placeholder="Enter shop ID" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full h-10" disabled={isLimitReached || loading}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUserForm; 