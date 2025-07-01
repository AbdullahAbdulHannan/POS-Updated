import React, { useState, useEffect } from "react"
import {
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  Package,
  Tag,
  Search,
  X,
  Save,
  Grid,
  List as ListIcon,
  DollarSign,
  Hash,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react"
import { Button, Modal, Form, Input, InputNumber, message, Card, List, Upload, Popconfirm, Spin } from "antd"
import axios from "axios"

// CategoryModal (no changes needed here)
const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category,
  loading = false
}) => {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (category) {
      setName(category.name || "")
    } else {
      setName("")
    }
    setError("")
  }, [category, isOpen])

  const handleSubmit = e => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Category name is required")
      return
    }


    onSave({ name: name.trim() })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setError("")
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-red-300" : "border-gray-300"
                }`}
              placeholder="Enter category name"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{category ? "Update" : "Create"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
const token = JSON.parse(localStorage.getItem("auth") || "{}").token
// ProductModal (no changes needed here)
const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    image: ""
  })
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([]);
  const [assignedStock, setAssignedStock] = useState({});
  
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  if (isOpen) {
    fetchUsers();
  }
}, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        image: product.image || ""
      })
    } else {
      setFormData({
        name: "",
        price: 0,
        quantity: 0,
        image: ""
      })
    }
    setErrors({})
  }, [product, isOpen])

  const handleSubmit = e => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0"
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
  name: formData.name.trim(),
  price: formData.price,
  quantity: formData.quantity,
  image: formData.image.trim() || undefined,
  assignedStock: Object.entries(assignedStock).map(([userId, quantity]) => ({
    userId,
    quantity,
  })),
});

  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                setErrors(prev => ({ ...prev, name: "" }))
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-300" : "border-gray-300"
                }`}
              placeholder="Enter product name"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0
                    }))
                    setErrors(prev => ({ ...prev, price: "" }))
                  }}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0
                    }))
                    setErrors(prev => ({ ...prev, quantity: "" }))
                  }}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantity ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="0"
                />
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="url"
                value={formData.image}
                onChange={e =>
                  setFormData(prev => ({ ...prev, image: e.target.value }))
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
{users.length > 0 && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Assign Stock to Users</label>
    {users.map((user) => (
      <div key={user._id} className="flex items-center gap-2">
        <span className="text-gray-600 w-32 truncate">{user.shopName || user.email}</span>
        <input
          type="number"
          min="0"
          value={assignedStock[user._id] || ""}
          onChange={(e) =>
            setAssignedStock((prev) => ({
              ...prev,
              [user._id]: parseInt(e.target.value) || 0,
            }))
          }
          className="w-32 px-3 py-1 border rounded-lg focus:ring focus:ring-blue-500"
          placeholder="0"
        />
      </div>
    ))}
  </div>
)}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{product ? "Update" : "Create"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CategoryItemsManager = () => {
  const [categories, setCategories] = useState([])
  // products will now *always* be an array of products for the currently selected category
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [loading, setLoading] = useState(false)

  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    category: null
  })

  const [productModal, setProductModal] = useState({
    isOpen: false,
    product: null
  })

  const token = JSON.parse(localStorage.getItem("auth") || "{}").token
  const [axiosConfig, setAxiosConfig] = useState({ headers: { Authorization: `Bearer ${token}` } })

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Refetch products whenever selectedCategory changes (or initially set)
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory._id)
    } else {
      // Clear products when no category is selected
      setProducts([]);
    }
  }, [selectedCategory]); // Depend on selectedCategory


  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/category", axiosConfig)
      setCategories(res.data || [])

    } catch (error) {
      message.error("Failed to fetch categories")
    }
    setLoading(false)
  }

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/products?categoryId=${categoryId}`, axiosConfig);
      setProducts(res.data || []); // This will now correctly set 'products' to an array
    } catch (error) {
      message.error("Failed to fetch products");
    }
    setLoading(false);
  };


  // Category handlers
  const handleAddCategory = () => {
    setCategoryModal({ isOpen: true, category: null })
  }

  const handleEditCategory = category => {
    setCategoryModal({ isOpen: true, category })
  }

  const handleDeleteCategory = async categoryId => {
    setLoading(true)
    try {
      await axios.delete(`/api/admin/category/${categoryId}`, axiosConfig)
      message.success("Category deleted")
      await fetchCategories() // Await to ensure categories are updated before potentially selecting null
      if (selectedCategory && selectedCategory._id === categoryId) {
        setSelectedCategory(null); // Deselect if the deleted category was active
      }
    } catch (error) {
      message.error("Failed to delete category")
    }
    setLoading(false)
  }

  const handleSaveCategory = async data => {
    setLoading(true)
    try {
      if (categoryModal.category) {
        // Update existing category
        await axios.put(`/api/admin/category/${categoryModal.category._id}`, data, axiosConfig)
        message.success("Category updated")
      } else {
        // Create new category
        await axios.post("/api/admin/category/create", data, axiosConfig)
        message.success("Category created")
      }

      setCategoryModal({ isOpen: false, category: null })
      await fetchCategories() // Refetch categories to get the latest list (including new/updated item counts)
    } catch (error) {
      console.error("Save category error", error.response?.data || error.message)
      message.error("Failed to save category")
    }
    setLoading(false)
  }


  // Product handlers
  const handleAddProduct = () => {
    setProductModal({ isOpen: true, product: null })
  }

  const handleEditProduct = product => {
    setProductModal({ isOpen: true, product })
  }

  const handleDeleteProduct = async productId => {
    setLoading(true)
    try {
      await axios.delete(`/api/admin/products/${productId}`, axiosConfig)
      message.success("Product deleted")
      // After deleting, refetch products for the current category
      if (selectedCategory) {
        fetchProducts(selectedCategory._id)
      }
    } catch (error) {
      message.error("Failed to delete product")
    }
    setLoading(false)
  }

  const handleSaveProduct = async data => {
    setLoading(true)
    try {
      if (productModal.product) {
        // Update existing product
        await axios.put(`/api/admin/products/${productModal.product._id}`, data, axiosConfig)
        message.success("Product updated")
      } else {
        // Create new product
        await axios.post(
          "/api/admin/products/create-product",
          { ...data, categoryId: selectedCategory._id },
          axiosConfig
        )
        message.success("Product added")
      }
      setProductModal({ isOpen: false, product: null })
      // Always refetch products for the current category after save/update/create
      if (selectedCategory) {
        fetchProducts(selectedCategory._id)
      }
    } catch (error) {
      message.error("Failed to save product")
    }
    setLoading(false)
  }


  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // This is the crucial change:
  // If selectedCategory is active, products state already holds the products for that category.
  // We just need to apply the search term filter on this array.
  const filteredProducts = selectedCategory
    ? products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];


  // Product view
  if (selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSearchTerm("")
                setProducts([]) // Clear products when going back to categories view
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Categories</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory.name}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
                  } transition-colors`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
                  } transition-colors`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map(product => (
              <div
                key={product._id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${viewMode === "list" ? "flex items-center p-4" : ""
                  }`}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={
                      viewMode === "list"
                        ? "w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                        : "w-full h-48 object-cover"
                    }
                  />
                )}

                <div className={`${viewMode === "list" ? "flex-1" : "p-4"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        Rs.{product.price}
                      </p>
                      <p
                        className={`text-sm ${product.quantity > 10
                            ? "text-gray-600"
                            : product.quantity > 0
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                      >
                        Stock: {product.quantity}
                        {product.quantity <= 10 && product.quantity > 0 && (
                          <AlertTriangle className="inline h-3 w-3 ml-1" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No products match "${searchTerm}"`
                : "No products in this category yet"}
            </p>
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Product</span>
            </button>
          </div>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={productModal.isOpen}
          onClose={() => setProductModal({ isOpen: false, product: null })}
          onSave={handleSaveProduct}
          product={productModal.product}
          loading={loading}
        />
      </div>
    )
  }

  // Categories view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {loading && !selectedCategory ? ( // Show loader for categories view as well
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map(category => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => {
                setSelectedCategory(category)
                setSearchTerm("") // Clear search term when switching category
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Tag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex space-x-1 ">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleEditCategory(category)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <Popconfirm
                      title="Delete category"
                      description="Are you sure to delete this category? This will also delete all products within it."
                      onConfirm={e => {
                        e.stopPropagation(); // Prevent card click from firing
                        handleDeleteCategory(category._id);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button
                        onClick={e => e.stopPropagation()} // Stop propagation here too for the button itself
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Popconfirm>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>

                <div className="flex items-center justify-between">
                 
                  <div className="flex items-center text-blue-600 text-sm">
                    <span>View products</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? `No categories match "${searchTerm}"`
              : "Create your first category to get started"}
          </p>
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Category</span>
          </button>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
        category={categoryModal.category}
        loading={loading}
      />
    </div>
  )
}

export default CategoryItemsManager