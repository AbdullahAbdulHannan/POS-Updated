import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Edit3,
  Save,
  X,
  Camera,
  Store,
  CreditCard,
  Clock,
  BarChart3,
  KeyRound
} from "lucide-react";
import { Modal, Form, Input, message } from "antd";
import axios from "../utils/axiosConfig";
const Profile = () => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    adminId: "",
    email: "",
    number: "",
    role: "cashier",
    address: "",
    createdAt: "",
    expiresAt: "",
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}").token;
        const { data } = await axios.get("/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        setFormData({
          ...data,
          paymentMethods: data.paymentMethods || ["cash"],
          stripeSecret: data.stripeSecret || ""
        });
      } catch (error) {
        message.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}").token;
      const { data } = await axios.put("/api/admin/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      console.log(user);
      
      setFormData(data);
      setEditing(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const showPasswordModal = () => {
    console.log('Opening password modal');
    setIsPasswordModalVisible(true);
  };

 const handlePasswordUpdate = async (values) => {
  try {
    const token = JSON.parse(localStorage.getItem("auth") || "{}").token;
    
    // Format the request body for the backend
    const requestBody = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword
    };

    console.log('Sending password update request:', { ...requestBody, newPassword: '[HIDDEN]' });
    
    await axios.put("/api/admin/update-password", requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    message.success("Password updated successfully!");
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  } catch (error) {
    console.error('Password update error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.msg || 
                        error.response?.data?.error ||
                        "Password update failed";
    message.error(errorMessage);
  }
};


  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          
          <div className="flex space-x-2">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={showPasswordModal}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Change Password</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
               
                
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-gray-600 capitalize mb-2">{user.role}</p>
                <p className="text-sm text-gray-500">ID: {user.adminId}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>Expires: {new Date(user.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              
              <div className="p-6">
                
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {editing ? (
                          <input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            value={formData.number || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <number className="h-4 w-4 text-gray-400" />
                            <span>{user.number}</span>
                          </div>
                        )}
                      </div>

                     
                    </div>

                    

                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
  <div className="flex items-start gap-4">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={formData.paymentMethods?.includes("cash")}
        onChange={(e) => {
          if (e.target.checked) {
            handleInputChange("paymentMethods", [...new Set([...(formData.paymentMethods || []), "cash"])]);
          } else {
            handleInputChange("paymentMethods", (formData.paymentMethods || []).filter(pm => pm !== "cash"));
          }
        }}
        className="h-4 w-4 text-blue-600"
      />
      <span>Cash</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={formData.paymentMethods?.includes("stripe")}
        onChange={(e) => {
          if (e.target.checked) {
            handleInputChange("paymentMethods", [...new Set([...(formData.paymentMethods || []), "stripe"])]);
          } else {
            handleInputChange("paymentMethods", (formData.paymentMethods || []).filter(pm => pm !== "stripe"));
          }
        }}
        className="h-4 w-4 text-blue-600"
      />
      <span>Stripe</span>
    </label>
  </div>
</div>

{formData.paymentMethods?.includes("stripe") && (
  <div className="mt-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
    <input
      type="text"
      value={formData.stripeSecret || ""}
      onChange={(e) => handleInputChange("stripeSecret", e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="sk_test_..."
    />
  </div>
)}

                  </div>
                


              </div>
            </div>
          </div>
        </div>

        {/* Password Update Modal */}
        <Modal
          title={<div className="text-lg font-semibold">Change Password</div>}
          visible={isPasswordModalVisible}
          onCancel={() => {
            console.log('Closing password modal');
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
          }}
          footer={null}
          width={400}
          maskClosable={false}
          destroyOnClose={true}
          centered
          className="password-update-modal"
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordUpdate}
            className="space-y-4"
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: "Please enter your current password" }]}
            >
              <Input.Password 
                prefix={<Lock className="text-gray-400 h-5 w-5" />}
                placeholder="Enter current password"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password 
                prefix={<Lock className="text-gray-400 h-5 w-5" />}
                placeholder="Enter new password"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<Lock className="text-gray-400 h-5 w-5" />}
                placeholder="Confirm new password"
                className="h-11 rounded-lg"
              />
            </Form.Item>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => {
                  console.log('Canceling password update');
                  setIsPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
            </div>
          </Form>
        </Modal>
      </div>
  );
};

export default Profile;