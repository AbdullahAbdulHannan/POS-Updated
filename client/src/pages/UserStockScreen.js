import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Package, Loader } from "lucide-react";

const UserStockScreen = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = auth.token;
  const userId = auth.user?._id;

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`/api/admin/products/user-stock/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache"
          }
        });

        if (res.status === 200 && Array.isArray(res.data)) {
          setStockData(res.data);
        } else {
          setStockData([]); // fallback
        }

      } catch (err) {
        console.error("Failed to load user stock", err);
        setStockData([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStock();
  }, [userId]); //  stable dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading stock...</span>
      </div>
    );
  }

  if (!stockData.length) {
    return (
      <div className="text-center py-16">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No stock assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Assigned Stock</h2>
      <div className="space-y-4">
        {stockData.map((item) => (
          <div
            key={item.productId}
            className="p-4 bg-white rounded-lg shadow border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {item.name}
            </h3>
            <p className="text-gray-600">Available: {item.assignedQuantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStockScreen;
