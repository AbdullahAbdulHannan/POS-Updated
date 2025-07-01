import React from "react"
import { Users, Receipt, DollarSign, ChevronRight } from "lucide-react"

const UserSelectionCards = ({ users, selectedUser, onUserSelect, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Select User to View Bills
        </h2>
        <span className="text-sm text-gray-500">
          {users.length} users found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* All Users Card */}
        <div
          onClick={() => onUserSelect("all")}
          className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
            selectedUser === "all"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">All Users</h3>
                <p className="text-sm text-gray-500">View all bills</p>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                selectedUser === "all"
                  ? "rotate-90 text-blue-600"
                  : "text-gray-400"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Receipt className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">
                {users.reduce((sum, user) => sum + user.billCount, 0)} bills
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">
                Rs.{" "}
                {users
                  .reduce((sum, user) => sum + user.totalAmount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Individual User Cards */}
        {users.map(user => (
          <div
            key={user._id}
            onClick={() => onUserSelect(user._id)}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedUser === user._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">
                    ID: {user._id.slice(-8)}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  selectedUser === user._id
                    ? "rotate-90 text-blue-600"
                    : "text-gray-400"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Receipt className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{user.billCount} bills</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  ${user.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserSelectionCards
