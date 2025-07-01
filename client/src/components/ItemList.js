import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus } from "lucide-react"

const ItemList = ({ item, stock }) => {
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.rootReducer)

  // Check if item is already in cart
  const existingItem = cartItems.find(cartItem => cartItem._id === item._id)

  const handleAddToCart = () => {
    if (existingItem) {
      // If item exists, increment quantity
      dispatch({
        type: "UPDATE_CART",
        payload: { ...existingItem, quantity: existingItem.quantity + 1 }
      })
    } else {
      // If item doesn't exist, add new item
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1 }
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              Rs.{item.price}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {item.category?.name}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || (existingItem && existingItem.quantity >= stock)}
            aria-disabled={stock === 0 || (existingItem && existingItem.quantity >= stock)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              stock === 0 || (existingItem && existingItem.quantity >= stock)
                ? "bg-gray-400 text-white cursor-not-allowed"
                : existingItem
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {stock === 0 ? (
              <span>Out of Stock</span>
            ) : existingItem && existingItem.quantity >= stock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Show quantity if item is in cart */}
        {existingItem && (
          <div className="mt-2 text-center">
            <span className="text-sm text-green-600 font-medium">
              {existingItem.quantity} in cart
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemList
