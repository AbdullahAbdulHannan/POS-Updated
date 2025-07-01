import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";
import ChartDashboard from "../components/ChartDashboard";
import CreateUserForm from "../components/CreateUserForm";
import CategoryItemsManager from "../components/CategoryItemsManager";
import Profile from "../pages/Profile";
import AdminBillsScreen from "./AdminBills";
import AdminUsersScreen from "./AdminUsersScreen";
// import { useState } from "react";
// import { useEffect } from "react";
// import axios from "../utils/axiosConfig";


const AdminDashboard = () => {
  const adminId = JSON.parse(localStorage.getItem("auth")).admin._id;
  // const navigate = useNavigate()
  // const [data, setData] = useState(null)
  // const token = JSON.parse(localStorage.getItem("auth")).token;

  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     try {
  //       const res = await axios.get('/api/admin/dashboard', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //       setData(res.data)
  //     } catch (err) {
  //       if (err.response && err.response.status === 403) {
  //         // Subscription expired – redirect to Hold Screen
  //         navigate('/hold')
  //       }
  //     }
  //   }

  //   fetchDashboard()
  // }, [token, navigate])
  return (
    <DefaultLayout>
      <div className="">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
        <Routes>
          <Route path="analytics" element={<ChartDashboard adminId={adminId}/>} />
          <Route path="create-user" element={<CreateUserForm />} />
          <Route path="users" element={<AdminUsersScreen />} />
          <Route path="category-items" element={<CategoryItemsManager />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bills" element={<AdminBillsScreen />} />
          <Route path="" element={<Navigate to="analytics" replace />} />
        </Routes>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard; 