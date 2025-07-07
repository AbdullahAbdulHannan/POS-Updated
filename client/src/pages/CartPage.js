
import React, { useState, useEffect } from "react"
import axios from "../utils/axiosConfig"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Banknote
} from "lucide-react"

const getItemKey = (item) => {
  const inputs = item.inputs || {};
  if (item.priceType === "sqft") {
    return `${item._id}_${inputs.width || 0}_${inputs.height || 0}`;
  }
  if (item.priceType === "lf") {
    return `${item._id}_${inputs.length || 0}`;
  }
  return item._id;
};

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [stockData, setStockData] = useState([]);
  const [allowedModes, setAllowedModes] = useState([]);
  const [stripeKey, setStripeKey] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(state => state.rootReducer);

  const getTierPrice = (value, tiers = []) => {
    for (let tier of tiers) {
      const max = tier.max ?? Infinity;
      if (value >= tier.min && value <= max) return tier.price;
    }
    return 0;
  };

  const getStockInfo = (item) => {
    const stock = stockData.find(s => s.productId === item._id)?.assignedQuantity ?? 0;
    const totalStockUsed = cartItems
      .filter(cartItem => cartItem._id === item._id)
      .reduce((total, cartItem) => total + (cartItem.quantity || 0), 0);
    const remainingStock = Math.max(0, stock - totalStockUsed + item.quantity);
    return { stock, totalStockUsed, remainingStock };
  };

  const getItemStockUsage = (item) => {
    const inputs = item.inputs || {};
    const quantity = item.quantity || 0;
    if (item.priceType === "sqft") {
      const width = parseFloat(inputs.width || 0);
      const height = parseFloat(inputs.height || 0);
      return width * height * quantity;
    } else if (item.priceType === "lf") {
      const length = parseFloat(inputs.length || 0);
      return length * quantity;
    } else {
      return quantity;
    }
  };

  const getIncrementedStockUsage = (item) => {
    const inputs = item.inputs || {};
    if (item.priceType === "sqft") {
      const width = parseFloat(inputs.width || 0);
      const height = parseFloat(inputs.height || 0);
      return width * height;
    } else if (item.priceType === "lf") {
      const length = parseFloat(inputs.length || 0);
      return length;
    } else {
      return 1;
    }
  };

  const calculateItemTotal = (item) => {
    const inputs = item.inputs || {};
    const quantity = item.quantity || 0;
    let baseQty = 0;

    if (item.priceType === "sqft") {
      const width = parseFloat(inputs.width || 0);
      const height = parseFloat(inputs.height || 0);
      baseQty = width * height * quantity;
    } else if (item.priceType === "lf") {
      const length = parseFloat(inputs.length || 0);
      baseQty = length * quantity;
    } else {
      baseQty = quantity;
    }

    if (isNaN(baseQty) || baseQty <= 0) return 0;

    let finalPrice = item.price;

    if (item.pricingMode === "tier" && Array.isArray(item.tierPricing)) {
      for (let tier of item.tierPricing) {
        const min = tier.min;
        const max = tier.max ?? Infinity;
        if (baseQty >= min && baseQty <= max) {
          finalPrice = tier.price;
          break;
        }
      }
    }

    return finalPrice * baseQty;
  };


  useEffect(() => {
    let temp = 0;
    cartItems.forEach(item => (temp += calculateItemTotal(item)));
    setSubTotal(temp);
  }, [cartItems]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = auth.token;
    const userId = auth.user?._id;
    const adminId = auth.user?.admin;

    const fetchStock = async () => {
      try {
        const res = await axios.get(`/api/admin/products/user-stock/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStockData(Array.isArray(res.data) ? res.data : []);
      } catch {
        setStockData([]);
      }
    };

    const fetchPaymentModes = async () => {
      try {
        const res = await axios.get(`/api/admin/${adminId}/payment-modes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setAllowedModes(res.data.modes || []);
          setStripeKey(res.data.stripeKey || null);
        }
      } catch {
        setAllowedModes(["cash"]);
      }
    };

    if (userId) fetchStock();
    if (adminId) fetchPaymentModes();
  }, []);

  const handleIncrement = (item) => {
    const { stock } = getStockInfo(item);
    // Calculate total stock used by all items of this product
    const totalStockUsed = cartItems
      .filter(cartItem => cartItem._id === item._id)
      .reduce((total, cartItem) => total + getItemStockUsage(cartItem), 0);
    // Calculate how much stock would be used if incremented
    const incrementUsage = getIncrementedStockUsage(item);
    if (totalStockUsed + incrementUsage <= stock) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...item, quantity: item.quantity + 1 }
      });
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...item, quantity: item.quantity - 1 }
      });
    }
  };

  const handleRemove = (item) => {
    dispatch({ type: "DELETE_FROM_CART", payload: item });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const tax = Number(((subTotal / 100) * 10).toFixed(2));
    const totalAmount = Number(subTotal) + tax;

    const newBill = {
      customerName,
      customerNumber,
      paymentMode,
      cartItems,
      subTotal,
      tax,
      totalAmount,
      userId: auth.user?._id,
      adminId: auth.user?.role === "admin" ? auth.user._id : auth.user?.admin,
    };

    console.log("Sending to backend:", newBill);

    if (paymentMode === "cash") {
      try {
        await axios.post("/api/bills/add-bills", newBill, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        alert("Bill Generated Successfully!");
        dispatch({ type: "EMPTY_CART" });
        navigate("/user/bills");
      } catch (err) {
        alert("Something went wrong");
      }
    } else if (paymentMode === "stripe") {
      if (!stripeKey) {
        alert("Stripe not configured for this Admin.");
        return;
      }
      try {
        const sessionRes = await axios.post("/api/bills/create-stripe-session", newBill, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (sessionRes.data?.url) {
          window.location.href = sessionRes.data.url;
        } else {
          console.error("Stripe session error:", sessionRes.data?.error);
          alert("Stripe session creation failed");
        }
      } catch (err) {
        console.error("Stripe session error:", err.message);
        alert("Stripe session failed");
      }
    }
  };

  const tax = Number(((subTotal / 100) * 10).toFixed(2));
  const totalAmount = Number(subTotal) + tax;

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Shopping Cart</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map(item => {
          const { stock, totalStockUsed, remainingStock } = getStockInfo(item);
          const totalPrice = calculateItemTotal(item);
          const inputs = item.inputs || {};

          // Calculate total stock used and increment usage for this item
          const incrementUsage = getIncrementedStockUsage(item);
          const canIncrement = totalStockUsed + incrementUsage <= stock;

          return (
            <div key={getItemKey(item)} className="bg-white border rounded p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-600">Rs.{totalPrice.toFixed(2)}</div>
                {(item.priceType === "sqft" || item.priceType === "lf") && (
                  <div className="text-sm text-gray-500">
                    {item.priceType === "sqft" && inputs.width && inputs.height && (
                      <div>
                        <div>Dimensions: {inputs.width} × {inputs.height} ft</div>
                        <div>Area: {(inputs.width * inputs.height).toFixed(2)} sqft × {item.quantity} = {(inputs.width * inputs.height * item.quantity).toFixed(2)} sqft</div>
                      </div>
                    )}
                    {item.priceType === "lf" && inputs.length && (
                      <div>
                        <div>Length: {inputs.length} ft</div>
                        <div>Total: {inputs.length} LF × {item.quantity} = {(inputs.length * item.quantity).toFixed(2)} LF</div>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {remainingStock <= 0 && (
                    <div className="text-red-500 font-medium">
                      ⚠️ Out of Stock
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDecrement(item)} disabled={item.quantity <= 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item)}
                  disabled={!canIncrement}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    !canIncrement
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                  title={!canIncrement ? 'No more stock available' : 'Add one more'}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div>
                <button onClick={() => handleRemove(item)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white border rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs.{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>Rs.{tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>Rs.{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => setBillPopup(true)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>

      {billPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Create Invoice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="w-full border p-2 rounded" />
              <input type="tel" placeholder="Contact Number" value={customerNumber} onChange={e => setCustomerNumber(e.target.value)} required className="w-full border p-2 rounded" />

              <div className="flex gap-4">
                {allowedModes.includes("cash") && (
                  <button type="button" onClick={() => setPaymentMode("cash")} className={`flex-1 p-2 border rounded ${paymentMode === "cash" ? "bg-blue-100 border-blue-500" : ""}`}>
                    <Banknote className="inline w-4 h-4 mr-1" /> Cash
                  </button>
                )}
                {allowedModes.includes("stripe") && (
                  <button type="button" onClick={() => setPaymentMode("stripe")} className={`flex-1 p-2 border rounded ${paymentMode === "stripe" ? "bg-blue-100 border-blue-500" : ""}`}>
                    <CreditCard className="inline w-4 h-4 mr-1" /> Card
                  </button>
                )}
              </div>

              <div className="space-y-1 text-sm bg-gray-50 p-3 rounded">
                <div className="flex justify-between"><span>Subtotal:</span><span>Rs.{subTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (10%):</span><span>Rs.{tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t"><span>Total:</span><span>Rs.{totalAmount.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setBillPopup(false)} className="flex-1 border p-2 rounded">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Generate Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

