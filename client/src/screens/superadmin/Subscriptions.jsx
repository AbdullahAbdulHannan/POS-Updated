import React, { useState, useEffect } from "react"
import {
  User,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Package,
  Phone,
  Lock,
  Info,
  Trash2
} from "lucide-react"
import axios from "../../utils/axiosConfig";
import { getTrustedUtcDate } from "../../utils/dateUtils";
import Spinner from '../../components/Spinner';

const SubscriptionsScreen = () => {
  const [admins, setAdmins] = useState([])
  const [filteredAdmins, setFilteredAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [trustedDate, setTrustedDate] = useState(null);

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = auth?.token;

  useEffect(() => {
    async function fetchTrustedDateAndAdmins() {
      // Always fetch a fresh trusted date
      let date = await getTrustedUtcDate();
      setTrustedDate(date);
      
      const res = await axios.get("/api/auth/superadmin/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = res.data;
      const formatted = data.map(admin => {
        const end = new Date(admin.endDate);
        const today = date ? new Date(date) : new Date();
        const diffTime = end.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = "active";
        if (daysRemaining <= 7 && daysRemaining > 0) status = "expiring";
        if (daysRemaining <= 0) status = "expired";

        return {
          id: admin.adminId._id,
          name: admin.name,
          email: admin.email,
          userId: admin.adminId.adminId,
          userName: admin.adminId.name,
          userPassword: admin.adminId.password,
          userNumber: admin.adminId.number,
          packageName: admin.packageName,
          startDate: admin.startDate,
          endDate: admin.endDate,
          daysRemaining,
          status,
          createdAt: admin.createdAt,
        };
      });
      setAdmins(formatted);
      setFilteredAdmins(formatted);
      setLoading(false);
    }
    fetchTrustedDateAndAdmins();
  }, []);

  // Filter admins
  useEffect(() => {
    let filtered = admins

    if (searchTerm) {
      filtered = filtered.filter(
        admin =>
          (admin.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.userId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.packageName || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(admin => admin.status === statusFilter)
    }

    setFilteredAdmins(filtered)
  }, [searchTerm, statusFilter, admins])

  const getStatusColor = status => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100"
      case "expiring":
        return "text-orange-600 bg-orange-100"
      case "expired":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "expiring":
        return <AlertTriangle className="h-4 w-4" />
      case "expired":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatDateTime = dateString => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleDelete = async (adminId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin and all their data?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/api/auth/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      setShowModal(false);
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "An error occurred while deleting admin.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Admins Information
          </h2>
          <p className="text-gray-600 mt-1">
            Manage admin accounts and their subscription details
          </p>
        </div>

        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {admins.length}
              </p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {admins.filter(a => a.status === "active").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">
                {admins.filter(a => a.status === "expiring").length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">
                {admins.filter(a => a.status === "expired").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.map(admin => (
          <div
            key={admin.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
              
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {admin.name}
                  </h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  admin.status
                )}`}
              >
                {getStatusIcon(admin.status)}
                <span>
                  {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                </span>
              </span>
              <span
                className={`inline-flex items-center  py-1 rounded-full text-xs font-medium`}
              >
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => handleDelete(admin.id)}/>
                
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Admin ID:</span>
                <span className="text-sm font-medium text-gray-900">
                  {admin.userId}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Package:</span>
                <span className="text-sm font-medium text-gray-900">
                  {admin.packageName}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Expires:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(admin.endDate)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Days Remaining:</span>
                <span
                  className={`text-sm font-semibold ${
                    admin.daysRemaining > 30
                      ? "text-green-600"
                      : admin.daysRemaining > 7
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {admin.daysRemaining > 0
                    ? `${admin.daysRemaining} days`
                    : "Expired"}
                </span>
              </div>

            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedAdmin(admin)
                  setShowModal(true)
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No admins found
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No admin accounts have been created yet"}
          </p>
        </div>
      )}

      {/* Admin Details Modal */}
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Admin Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedAdmin.name}
                  </h3>
                  <p className="text-gray-600">{selectedAdmin.email}</p>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                      selectedAdmin.status
                    )}`}
                  >
                    {getStatusIcon(selectedAdmin.status)}
                    <span>
                      {selectedAdmin.status.charAt(0).toUpperCase() +
                        selectedAdmin.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Account Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Admin ID:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.userId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.userName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Password:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.userPassword}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Phone Number:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.userNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDateTime(selectedAdmin.createdAt)}
                      </span>
                    </div>
                    
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Subscription Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Package:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedAdmin.packageName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedAdmin.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedAdmin.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Days Remaining:
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          selectedAdmin.daysRemaining > 30
                            ? "text-green-600"
                            : selectedAdmin.daysRemaining > 7
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedAdmin.daysRemaining > 0
                          ? `${selectedAdmin.daysRemaining} days`
                          : "Expired"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

             

              {selectedAdmin.daysRemaining <= 7 &&
                selectedAdmin.daysRemaining > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Subscription expires in {selectedAdmin.daysRemaining}{" "}
                        days
                      </span>
                    </div>
                  </div>
                )}

              {selectedAdmin.daysRemaining <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Subscription has expired
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionsScreen
