import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  FileText,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Store,
  BarChart2,
  UserPlus,
  Layers,
  UserCog,
  Package2
} from "lucide-react";
import Spinner from "./Spinner";

const adminMenuItems = [
  { key: "analytics", icon: BarChart2, label: "Analytics", path: "/admin" },
  { key: "create-user", icon: UserPlus, label: "Create User", path: "/admin/create-user" },
  { key: "my-users", icon: Users, label: "My Users", path: "/admin/users" },
  { key: "category-items", icon: Layers, label: "Create Category Items", path: "/admin/category-items" },
  { key: "profile", icon: UserCog, label: "Profile", path: "/admin/profile" },
  { key: "bills", icon: UserCog, label: "Invoices", path: "/admin/bills" },
];

const userMenuItems = [
  { key: "/", icon: Home, label: "Dashboard", path: "/user" },
  { key: "/bills", icon: FileText, label: "Bills", path: "/user/bills" },
  { key: "/mystock", icon: Package, label: "My Stock", path: "mystock" },
  // { key: "/customers", icon: Users, label: "Customers", path: "/customers" },
];
const superAdminMenuItems = [
  { key: "", icon: Home, label: "New Requests", path: "/superadmin" },
  { key: "create-admin", icon: UserPlus, label: "Create Admins", path: "/superadmin/create-admins" },
  { key: "subscriptions", icon: Package, label: "Subscriptions", path: "/superadmin/subscriptions" },
  { key: "packages", icon: Package2, label: "Packages", path: "/superadmin/packages" },
];

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const isAdminRoute = location.pathname.startsWith("/admin");
 const isSuperAdminRoute = location.pathname.startsWith("/superadmin");
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {loading && <Spinner />}
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">POS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-2">
            {(isAdminRoute ? adminMenuItems : isSuperAdminRoute?superAdminMenuItems: userMenuItems).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (isAdminRoute && location.pathname === "/admin" && item.path === "/admin/analytics");
              return (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {!isAdminRoute && !isSuperAdminRoute && (
              <div className="flex items-center space-x-4 ml-auto">
                <button
                  onClick={() => navigate("/user/cart")}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;