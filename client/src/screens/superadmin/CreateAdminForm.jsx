import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "../../utils/axiosConfig";
import { sendAdminEmail } from "../../utils/sendEmail";

const CreateAdminForm = () => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = auth.token;
      const res = await axios.post(
        "/api/auth/superadmin/create-admin",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(res.data?.message || "Admin created successfully!");
       if (res.status === 201) {
      await sendAdminEmail({
        name: values.name,
        email: values.email,
        adminId: values.adminId,
        password: values.password,
      });
    }
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to create admin. Admin ID and Email must be unique."
      );
    }
  };

  return (
    <Card className="max-w-lg mx-auto shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        <Form.Item
          name="adminId"
          label="Admin ID"
          rules={[{ required: true, message: "Please enter an Admin ID" }]}
        >
          <Input placeholder="Enter admin ID" />
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
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full h-10">
            Create Admin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAdminForm; 