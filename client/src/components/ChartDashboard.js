import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { BarChart3, CreditCard } from "lucide-react";
import axios from "../utils/axiosConfig";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartDashboard = ({ adminId }) => {
  const [salesData, setSalesData] = useState([]);
  const [ordersByCategory, setOrdersByCategory] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const token = JSON.parse(localStorage.getItem("auth") || "{}").token;

 

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [salesRes, ordersRes, monthlyRes, topCatRes] = await Promise.all([
        axios.get("/api/admin/analytics/total-sales", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/admin/analytics/total-orders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/admin/analytics/monthly-sales", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/admin/analytics/top-categories", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setTotalSales(salesRes.data.totalSales || 0);
      setTotalOrders(ordersRes.data.totalOrders || 0);

      setSalesData(monthlyRes.data || []);

      const catBar = (topCatRes.data || []).map(c => ({
        category: c.category,
        orders: c.totalSold
      }));
      setOrdersByCategory((topCatRes.data || []).map(c => ({
        category: c.name,
        orders: c.value,
      })));

      // const catPie = (topCatRes.data || []).map(c => ({
      //   name: c.category,
      //   value: c.totalSold
      // }));
      setTopCategories(
        (topCatRes.data || []).map(c => ({
          name: c.name,
          value: c.value
        }))
      );

      console.log("Top Categories:", topCategories);
      console.log("Top Categories:", topCatRes.data);
      console.log("Orders by Category:", catBar);
      // console.log("Sales Data:", transformedSales);

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  fetchDashboardData();
}, [adminId]);


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Sales</p>
              <p className="text-2xl font-bold text-blue-900">${Number(totalSales).toFixed(0)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Orders</p>
              <p className="text-2xl font-bold text-green-900">{totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-900">
                ${totalSales && totalOrders ? (totalSales / totalOrders).toFixed(0) : 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
  <Card title="Total Sales (Monthly)" className="shadow rounded-lg">
    {salesData.length ? (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="text-center py-10 text-gray-400">No monthly sales data</div>
    )}
  </Card>
</Col>

        <Col xs={24} md={8}>
          <Card title="Top Categories" className="shadow rounded-lg">
            {topCategories.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={topCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-gray-400">No category data</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card title="Orders by Category" className="shadow rounded-lg">
            {ordersByCategory.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ordersByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#82ca9d" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-gray-400">No order data</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartDashboard;