import React, { useState, useEffect } from 'react';
import { useBills } from '../hooks/useBills';
import BillsFilters from '../components/BillsFilters';
import BillsTable from '../components/BillsTable';
import InvoiceModal from '../components/InvoiceModal';

const BillsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const {
    billsData,
    filteredBills,
    loading,
    filterBills
  } = useBills("/api/bills/get-bills", false);

  // Apply filters whenever search term or date filter changes
  useEffect(() => {
    filterBills(searchTerm, dateFilter);
  }, [searchTerm, dateFilter, billsData]);

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setPopupModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BillsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          title="My Invoices"
        />

        <BillsTable
          filteredBills={filteredBills}
          billsData={billsData}
          onViewBill={handleViewBill}
          loading={loading}
          isAdminView={false}
        />

        <InvoiceModal
          isOpen={popupModal}
          onClose={() => setPopupModal(false)}
          selectedBill={selectedBill}
        />
      </div>
    </div>
  );
};

export default BillsPage;