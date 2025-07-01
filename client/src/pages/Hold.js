import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import axios from "../utils/axiosConfig";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51RfFqjPIM2xb8ciPB6UGYDf4LLIIwOb1D2Jml1XYY0b7AY3QrjUjQvykBN7yxyfb76lsncJJWMZpkhsbwqtrrFcz00de9a1c7Q");

const Hold = () => {
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("/api/packages");
        setPackages(res.data);
      } catch (err) {
        message.error("Failed to fetch packages");
      }
    };
    fetchPackages();
  }, []);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Subscription Expired</h2>
        <p className="mb-6 text-gray-700">
          Your access is currently on hold. Please renew your subscription to continue.
        </p>
       
        <p className="text-gray-900 mt-4">Need help? Contact support</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Renew Subscription</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter your registered email"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Package</label>
              <select
                className="w-full border p-2 rounded"
                value={selectedPackage?._id || ""}
                onChange={e => {
                  const pkg = packages.find(p => p._id === e.target.value);
                  setSelectedPackage(pkg);
                }}
              >
                <option value="">Choose a package</option>
                {packages.map(pkg => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.title} - ${pkg.amount} / {pkg.durationInDays} days
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hold;
