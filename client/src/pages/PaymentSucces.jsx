import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../utils/axiosConfig";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying payment...");
// const navigate = useNavigate();
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const packageId = searchParams.get("packageId");

      try {
        const { data } = await axios.get(
          `/api/checkout/verify-session/${sessionId}?name=${name}&email=${email}&packageId=${packageId}`
        );
        setMessage(data.message);
      } catch (err) {
        console.error("Payment verification failed:", err);
        setMessage("❌ Payment verification failed");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 text-center">
      <div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Success</h1>
        <p className="text-lg text-gray-800">{message}</p>
        <p className="text-lg text-gray-800">We will contact you soon!</p>
         <Link to={'/'}>
         <button
            // onClick={navigate('/')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
            Go to Home
          </button>
            </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
