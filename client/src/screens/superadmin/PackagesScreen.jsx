import React, { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Edit3, Trash2, CheckCircle } from "lucide-react"

const PackagesScreen = () => {
  const [packages, setPackages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [form, setForm] = useState({
    title: "",
    amount: "",
    durationInDays: ""
  })
const token = JSON.parse(localStorage.getItem("auth") || "{}").token
  const fetchPackages = async () => {
    try {
      const { data } = await axios.get("/api/packages")
      setPackages(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingPackage) {
        await axios.put(`/api/packages/${editingPackage._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post("/api/packages", form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowModal(false)
      setEditingPackage(null)
      setForm({ title: "", amount: "", durationInDays: "" })
      fetchPackages()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm("Delete this package?")) return
    try {
      await axios.delete(`/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPackages()
    } catch (err) {
      console.error(err)
    }
  }

  const openEdit = pkg => {
    setEditingPackage(pkg)
    setForm({
      title: pkg.title,
      amount: pkg.amount.toString(),
      durationInDays: pkg.durationInDays.toString()
    })
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Package Management
        </h2>
        <button
          onClick={() => {
            setEditingPackage(null)
            setForm({ title: "", amount: "", durationInDays: "" })
            setShowModal(true)
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {pkg.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  $ {pkg.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {pkg.durationInDays} days
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(pkg)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" /> Active
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingPackage ? "Edit Package" : "Add New Package"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={form.durationInDays}
                  onChange={e =>
                    setForm({ ...form, durationInDays: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPackage ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PackagesScreen
