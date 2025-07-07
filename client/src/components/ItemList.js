import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

const getTierPrice = (qty, tiers = []) => {
  for (let tier of tiers) {
    const max = tier.max ?? Infinity;
    if (qty >= tier.min && qty <= max) {
      return tier.price;
    }
  }
  return null;
};

const ItemList = ({ item, stock }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);
  
  // Create a unique identifier that includes dimensions for sqft and lf items
  const getItemKey = (item, inputs) => {
    if (item.priceType === "sqft") {
      return `${item._id}_${inputs.width || 0}_${inputs.height || 0}`;
    }
    if (item.priceType === "lf") {
      return `${item._id}_${inputs.length || 0}`;
    }
    return item._id;
  };

  const [inputs, setInputs] = useState({ width: "", height: "", length: "", quantity: 1 });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Find existing item using the new key logic
  const existingItem = cartItems.find((cartItem) => {
    const cartItemKey = getItemKey(cartItem, cartItem.inputs || {});
    const currentItemKey = getItemKey(item, inputs);
    return cartItemKey === currentItemKey;
  });

  const computePrice = () => {
    const quantity = parseFloat(inputs.quantity) || 0;
    let baseQty = 0;
    let price = 0;

    if (item.priceType === "sqft") {
      const width = parseFloat(inputs.width) || 0;
      const height = parseFloat(inputs.height) || 0;
      const area = width * height;
      baseQty = quantity * area;
      const tierPrice = getTierPrice(baseQty, item.tierPricing);
      price = tierPrice !== null ? tierPrice : item.price;
      return { total: price * baseQty, unitPrice: price, label: `Rs.${price}/sqft`, qty: baseQty };
    }

    if (item.priceType === "lf") {
      const length = parseFloat(inputs.length) || 0;
      baseQty = quantity * length;
      const tierPrice = getTierPrice(baseQty, item.tierPricing);
      price = tierPrice !== null ? tierPrice : item.price;
      return { total: price * baseQty, unitPrice: price, label: `Rs.${price}/LF`, qty: baseQty };
    }

    baseQty = quantity;
    const tierPrice = getTierPrice(baseQty, item.tierPricing);
    price = tierPrice !== null ? tierPrice : item.price;
    return { total: price * baseQty, unitPrice: price, label: `Rs.${price}/unit`, qty: baseQty };
  };

  const { total, unitPrice, label, qty } = computePrice();

  // Helper: calculate stock usage for a cart item (in LF or sqft or units)
  const getItemStockUsage = (cartItem) => {
    const cartInputs = cartItem.inputs || {};
    const cartQuantity = cartItem.quantity || 0;
    if (item.priceType === "sqft") {
      const width = parseFloat(cartInputs.width || 0);
      const height = parseFloat(cartInputs.height || 0);
      return width * height * cartQuantity;
    } else if (item.priceType === "lf") {
      const length = parseFloat(cartInputs.length || 0);
      return length * cartQuantity;
    } else {
      return cartQuantity;
    }
  };

  // Calculate stock usage for the new item being added
  const getNewItemStockUsage = () => {
    if (item.priceType === "sqft") {
      const width = parseFloat(inputs.width) || 0;
      const height = parseFloat(inputs.height) || 0;
      const quantity = parseFloat(inputs.quantity) || 0;
      return width * height * quantity;
    } else if (item.priceType === "lf") {
      const length = parseFloat(inputs.length) || 0;
      const quantity = parseFloat(inputs.quantity) || 0;
      return length * quantity;
    } else {
      return parseFloat(inputs.quantity) || 0;
    }
  };

  // Calculate total stock used by this product across all dimension combinations
  const getTotalStockUsed = () => {
    return cartItems
      .filter(cartItem => cartItem._id === item._id)
      .reduce((total, cartItem) => total + getItemStockUsage(cartItem), 0);
  };

  const totalStockUsed = getTotalStockUsed();
  const newItemStockUsage = getNewItemStockUsage();

  const isOutOfStock =
    stock === 0 ||
    (totalStockUsed + newItemStockUsage > stock) ||
    newItemStockUsage <= 0;

  // Helper to check if input is valid for the current priceType
  const isInputValid = () => {
    if (item.priceType === "sqft") {
      return (
        parseFloat(inputs.width) > 0 &&
        parseFloat(inputs.height) > 0 &&
        parseFloat(inputs.quantity) > 0
      );
    }
    if (item.priceType === "lf") {
      return (
        parseFloat(inputs.length) > 0 &&
        parseFloat(inputs.quantity) > 0
      );
    }
    return parseFloat(inputs.quantity) > 0;
  };

  const canAddToCart = isInputValid() && !isOutOfStock;

  const handleAddToCart = () => {
    if (qty <= 0 || isOutOfStock) return;

    const inputQuantity = parseFloat(inputs.quantity);
    const payload = {
      ...item,
      quantity: existingItem ? existingItem.quantity + inputQuantity : inputQuantity,
      price: unitPrice,
      inputs: { ...inputs }
    };

    dispatch({ type: existingItem ? "UPDATE_CART" : "ADD_TO_CART", payload });
    setOpen(false);
    setInputs({ width: "", height: "", length: "", quantity: 1 });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 space-y-2">
      <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-600">{label}</p>

      <button
        onClick={() => setOpen(true)}
        className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 ${
          stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={stock === 0}
      >
        <Plus className="h-4 w-4" />
        {stock === 0 ? "Out of Stock" : "Add"}
      </button>

      {existingItem && (
        <p className="text-sm text-green-600 text-center">
          {existingItem.quantity} in cart
        </p>
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>

            {item.priceType === "sqft" && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="width"
                  placeholder="Width"
                  value={inputs.width}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="number"
                  name="height"
                  placeholder="Height"
                  value={inputs.height}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded"
                />
              </div>
            )}

            {item.priceType === "lf" && (
              <input
                type="number"
                name="length"
                placeholder="Length"
                value={inputs.length}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            )}

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              min="1"
              value={inputs.quantity}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            />

            <div className="text-sm text-gray-600">
              {qty > 0 && !isNaN(qty) && `Required Qty: ${qty.toFixed(0)} ${item.priceType === "sqft" ? "sqft" : item.priceType === "lf" ? "lf" : "unit"}`}
            </div>

            {/* Stock information */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div>Available Stock: {stock}</div>
              <div>Used Stock: {totalStockUsed}</div>
              <div>Remaining Stock: {Math.max(0, stock - totalStockUsed)}</div>
              {totalStockUsed > 0 && (
                <div className="text-blue-600">
                  Note: Stock is shared across all sizes of this product
                </div>
              )}
            </div>

            {isOutOfStock && (
              <p className="text-sm text-red-600">Out of stock or exceeding available quantity</p>
            )}

            <div className="flex justify-between items-center pt-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!isInputValid() || isOutOfStock}
                className={`px-4 py-2 rounded-lg text-white ${
                  !isInputValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {!isInputValid()
                  ? "Enter size"
                  : isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
