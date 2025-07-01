import React, { useState, useEffect } from 'react';
import { useBills } from '../hooks/useBills';
import BillsFilters from '../components/BillsFilters';
import BillsTable from '../components/BillsTable';
import InvoiceModal from '../components/InvoiceModal';
import UserSelectionCards from '../components/UserSelectionCards';
import { ArrowLeft } from 'lucide-react';

const AdminBillsScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedUser, setSelectedUser] = useState('all');
  const [showTable, setShowTable] = useState(false);

  const {
    billsData,
    filteredBills,
    users,
    loading,
    filterBills
  } = useBills("/api/bills/admin/bills", true);

  // Apply filters whenever search term, date filter, or selected user changes
  useEffect(() => {
    filterBills(searchTerm, dateFilter, selectedUser);
  }, [searchTerm, dateFilter, selectedUser, billsData]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setShowTable(true);
  };

  const handleBackToUsers = () => {
    setShowTable(false);
    setSelectedUser('all');
    setSearchTerm("");
    setDateFilter("all");
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setPopupModal(true);
  };

  const getSelectedUserName = () => {
    if (selectedUser === 'all') return 'All Users';
    const user = users.find(u => u._id === selectedUser);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {!showTable ? (
          <>
            {/* User Selection View */}

            <UserSelectionCards
              users={users}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              loading={loading}
            />
          </>
        ) : (
          <>
            {/* Bills Table View */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleBackToUsers}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Users</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Invoices for: {getSelectedUserName()}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredBills.length} invoice{filteredBills.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <BillsFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              title={`${getSelectedUserName()} - Invoices`}
            />

            <BillsTable
              filteredBills={filteredBills}
              billsData={billsData}
              onViewBill={handleViewBill}
              loading={loading}
              isAdminView={true}
              selectedUser={selectedUser}
              users={users}
            />
          </>
        )}

        <InvoiceModal
          isOpen={popupModal}
          onClose={() => setPopupModal(false)}
          selectedBill={selectedBill}
        />
      </div>
    </div>
  );
};

export default AdminBillsScreen;