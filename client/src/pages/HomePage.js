import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Store, Star, ArrowRight,
  Shield, Zap, Users, BarChart3, 
  
} from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';

import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe Publishable Key
const HomePage = () => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const navigate = useNavigate();
 const [packages, setPackages] = useState([]);
const [selectedPackage, setSelectedPackage] = useState(null);
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });

  // 🔁 Fetch packages from backend on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/api/packages');
        setPackages(res.data);
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };

    fetchPackages();
  }, []);


const initiateCheckout = async () => {
  const { name, email } = formData;
  if (!name || !email) return alert("Name and email are required");

  try {
    // 1. CHECK EMAIL FIRST BEFORE ANYTHING
    const emailCheck = await axios.get(`/api/checkout/check-email?email=${email}`);
    if (emailCheck.status !== 200) {
      alert("Email is already used. Please use a different one.");
      return;
    }

    // 2. CREATE SESSION ONLY IF EMAIL IS FREE
    const { data } = await axios.post("/api/checkout/create-session", {
      packageId: selectedPackage._id,
      name,
      email,
    });

    if (!data.sessionId) {
      alert("Stripe URL not received");
      return;
    }

    const stripe = await loadStripe("pk_test_51RfFqjPIM2xb8ciPB6UGYDf4LLIIwOb1D2Jml1XYY0b7AY3QrjUjQvykBN7yxyfb76lsncJJWMZpkhsbwqtrrFcz00de9a1c7Q");
    await stripe.redirectToCheckout({ sessionId: data.sessionId });

  } catch (error) {
    if (error?.response?.status === 409) {
      alert("This email already exists. Try another.");
    } else {
      alert("Checkout failed. Please try again.");
    }
    console.error("Checkout error:", error);
  } finally {
    setShowModal(false);
    setFormData({ name: '', email: '' });
  }
};






  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern POS System
              <span className="block text-blue-600">for Your Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your sales, manage inventory, and grow your business with our 
              comprehensive point-of-sale solution designed for modern retailers.
            </p>
          
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sales Analytics</h3>
              <p className="text-gray-600">Track your sales performance with detailed reports and insights</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Accept payments securely with multiple payment options</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">Manage your team with role-based access control</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Lightning-fast performance with 99.9% uptime guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing options to fit your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${
                  pkg.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    {/* <p className="text-gray-600 mb-4">{pkg.description || '...'}</p> */}
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">$ {pkg.amount?.toLocaleString()}</span>
                      <span className="text-gray-600 ml-2">/ {pkg.durationInDays} days</span>
                    </div>
                  </div>

                  <button
  onClick={() => {
    setSelectedPackage(pkg);
    setShowModal(true);
  }}
  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
    pkg.popular
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  }`}
>
  Get Started
</button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-35">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-2 mb-3 rounded"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-4 rounded"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            setShowModal(false);
            setFormData({ name: '', email: '' });
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={initiateCheckout}
        >
          Continue to Pay
        </button>
      </div>
    </div>
  </div>
)}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;