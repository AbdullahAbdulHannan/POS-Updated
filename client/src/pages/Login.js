import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [role, setRole] = useState("user");

 const handleSubmit = async (values) => {
  const { identifier, password, role } = values;
  console.log(role);

  try {
    // Superadmin login
    if (role === "superadmin") {
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
        const res = await axios.post("/api/auth/superadmin/login", {
          email: identifier,
          password,
        });

        if (res.data && res.data.token) {
          localStorage.setItem(
            "auth",
            JSON.stringify({ ...res.data, role: "superadmin" })
          );
          message.success("Superadmin logged in successfully!");
          navigate("/superadmin");
          return;
        }
      }
    }

    // Admin login
    if (role === "admin") {
      const res = await axios.post("/api/auth/admin/login", {
        adminId: identifier,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...res.data, role: "admin" })
        );
        message.success("Admin logged in successfully!");
        navigate("/admin");
        return;
      }
    }

    // User login
    if (role === "user") {
      const res = await axios.post("/api/auth/user/login", {
        userId: identifier,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...res.data, role: "user" })
        );
        message.success("User logged in successfully!");
        navigate("/user");
        return;
      }
    }

    message.error("Invalid credentials or role.");
  } catch (error) {
    // ⛔ Handle subscription expiry for Admin/User
    if (error.response?.data?.message === "Subscription expired") {
      message.error("Your subscription has expired. Please contact support.");
      navigate("/hold");
      return;
    }

    message.error(
      error.response?.data?.message || "Login failed. Please check your credentials."
    );
  }
};


  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { role } = JSON.parse(auth);
      if (role === "superadmin") navigate("/superadmin");
      else if (role === "admin") navigate("/admin");
      else if (role === "user") navigate("/user");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-gray-900">POS App</Title>
          <Text className="text-gray-600 mt-2 block">Login as Superadmin, Admin, or User</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-8 space-y-6"
          initialValues={{ role: "user" }}
        >
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select onChange={setRole}>
              <Option value="superadmin">Superadmin</Option>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="identifier"
            label={role === "admin" ? "Admin ID" : role === "superadmin" ? "Superadmin email" : "User ID"}
            rules={[{ required: true, message: `Please enter your ${role === "admin" ? "Admin ID" : role === "superadmin" ? "Superadmin email" : "User ID"}` }]}
          >
            <Input placeholder={`Enter your ${role === "admin" ? "Admin ID" : role === "superadmin" ? "Superadmin email" : "User ID"}`} className="h-11 rounded-lg" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" className="h-11 rounded-lg" />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="h-11 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
