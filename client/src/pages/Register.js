import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { User, Lock, UserCircle } from "lucide-react";

const { Title, Text } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/users/register", value);
      message.success("Registered successfully!");
      dispatch({ type: "HIDE_LOADING" });
      navigate("/login");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something went wrong.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-gray-900">POS App</Title>
          <Text className="text-gray-600 mt-2 block">Create your account</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} className="mt-8 space-y-6">
          <Form.Item
            name="name"
            label={<span className="text-gray-700 font-medium">Full Name</span>}
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input 
              prefix={<UserCircle className="text-gray-400 h-5 w-5" />}
              placeholder="Enter your full name"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="userId"
            label={<span className="text-gray-700 font-medium">User ID</span>}
            rules={[{ required: true, message: "Please choose a User ID" }]}
          >
            <Input 
              prefix={<User className="text-gray-400 h-5 w-5" />}
              placeholder="Choose a User ID"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">Password</span>}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password 
              prefix={<Lock className="text-gray-400 h-5 w-5" />}
              placeholder="Create a secure password"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          <div className="flex flex-col space-y-4">
            <Button 
              type="primary" 
              htmlType="submit"
              className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Create Account
            </Button>
            
            <div className="text-center">
              <Text className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </Text>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
