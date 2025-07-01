import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import { Search, Filter } from "lucide-react";

const UserMain=()=>{
    const [itemsData, setItemsData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [stockData, setStockData] = useState([]);
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          dispatch({ type: "SHOW_LOADING" });
          const token = JSON.parse(localStorage.getItem("auth") || "{}").token
          const { data } = await axios.get("/api/admin/category/user-categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const mapped = data.map((cat) => ({
            _id: cat._id,
            name: cat.name,
            label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
          }));
          setCategories(mapped);
          if (mapped.length > 0 && !selectedCategory) {
            setSelectedCategory(mapped[0]._id);
          }
          dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
          dispatch({ type: "HIDE_LOADING" });
        }
      };
      fetchCategories();
    }, [dispatch]);

    useEffect(() => {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = auth.token;
      const userId = auth.user?._id;
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
            setStockData([]);
          }
        } catch (err) {
          setStockData([]);
        }
      };
      if (auth.user?._id) fetchStock();
    }, []);

    useEffect(() => {
      if (!selectedCategory) return;
      const fetchProducts = async () => {
        try {
          dispatch({ type: "SHOW_LOADING" });
          const token = JSON.parse(localStorage.getItem("auth") || "{}").token
          const { data } = await axios.get(`/api/admin/products/user-products?categoryId=${selectedCategory}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setItemsData(data);
          dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
          dispatch({ type: "HIDE_LOADING" });
        }
      };
      fetchProducts();
    }, [selectedCategory, dispatch]);

    const filteredItems = itemsData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
return(
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-600 mt-1">Browse and add items to your cart</p>
          </div>
          <div className="relative mt-4 sm:mt-0 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Categories */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                selectedCategory === category._id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium capitalize">{category.label}</span>
            </button>
          ))}
        </div>
        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemList key={item._id} item={item} stock={stockData.find(s => s.productId === item._id)?.assignedQuantity ?? 0} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No items match "${searchTerm}" in ${selectedCategory}`
                  : `No items available in ${selectedCategory} category`
                }
              </p>
            </div>
          )}
        </div>
      </div>
)  
}

export default UserMain;