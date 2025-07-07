// src/pages/CheckoutSuccess.jsx
import React, { useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");

        const res = await axios.post("/api/bills/verify-stripe-session", { sessionId }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });

        if (res.status === 200) {
          dispatch({ type: "EMPTY_CART" });
          alert("Payment successful & bill saved!");
          navigate("/user/bills");
        } else {
          alert("Verification failed.");
        }
      } catch (err) {
        console.error("Session verify error:", err);
        alert("Something went wrong!");
      }
    };

    if (sessionId) verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold">Verifying your payment...</h2>
    </div>
  );
};

export default CheckoutSuccess;
