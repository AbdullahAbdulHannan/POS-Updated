import React, { useState, useEffect } from "react";
import {
  Clock, User, Mail, Calendar, DollarSign, Package, View
} from "lucide-react";
import axios from "../../utils/axiosConfig";
import { message } from "antd";

const NewRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const token = auth?.token;
  
        if (!token) {
          throw new Error("No token found in localStorage");
        }
  
        const res = await axios.get("/api/auth/superadmin/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setRequests(res.data);
      } catch (err) {
        console.error("💥 Error fetching requests:", err?.response?.data || err.message);
  
        if (err.response?.status === 401 || err.response?.status === 403) {
          message.error("Unauthorized. Please log in again.");
          localStorage.removeItem("auth");
          window.location.href = "/superadmin-login"; // adjust this route if needed
        }
      }
    };
  
    fetchRequests();
  }, []);
  

  const formatDate = date =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Requests</h2>
        <p className="text-gray-600">Manage new and renewal payment requests</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xl font-medium text-gray-600">Total Requests</p>
        <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
            
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(req => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{req.name}</div>
                      <div className="text-sm text-gray-500">{req.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{req.packageName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">$ {req.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(req.paymentTime)}</td>
                
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <View className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try again later.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">User Info</h3>
                <p><User className="inline w-4 h-4 mr-1" /> {selectedRequest.name}</p>
                <p><Mail className="inline w-4 h-4 mr-1" /> {selectedRequest.email}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Package Info</h3>
                <p><Package className="inline w-4 h-4 mr-1" /> {selectedRequest.packageName}</p>
                <p><DollarSign className="inline w-4 h-4 mr-1" /> ${selectedRequest.amount}</p>
                <p><Calendar className="inline w-4 h-4 mr-1" /> {formatDate(selectedRequest.paymentTime)}</p>
                
              </div>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRequestsScreen;
