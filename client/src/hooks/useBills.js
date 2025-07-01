import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBills = (apiEndpoint, isAdmin = false) => {
  const [billsData, setBillsData] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [groupedBills, setGroupedBills] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("auth"))?.token;
      
      const { data } = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort bills by date (latest first)
      const sortedData = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setBillsData(sortedData);
      setFilteredBills(sortedData);

      if (isAdmin) {
        // Group bills by userId for admin view
        const grouped = data.reduce((acc, bill) => {
          const userKey = bill.user || "Unknown User";
          if (!acc[userKey]) acc[userKey] = [];
          acc[userKey].push(bill);
          return acc;
        }, {});

        setGroupedBills(grouped);

        // Extract unique users
        const uniqueUsers = Object.keys(grouped).map(userId => ({
          _id: userId,
          name: grouped[userId][0]?.userName || `User ${userId}`,
          billCount: grouped[userId].length,
          totalAmount: grouped[userId].reduce((sum, bill) => sum + bill.totalAmount, 0)
        }));

        setUsers(uniqueUsers);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch bills", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filterBills = (searchTerm, dateFilter, selectedUser = null) => {
    let filtered = billsData;

    // Filter by selected user (admin only)
    if (selectedUser && selectedUser !== 'all') {
      filtered = filtered.filter(bill => bill.user === selectedUser);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => {
        const customerName = bill.customerName?.toLowerCase() || "";
        const billId = bill._id?.toLowerCase() || "";
        const customerNumber = String(bill.customerNumber || "");

        return (
          customerName.includes(searchTerm.toLowerCase()) ||
          billId.includes(searchTerm.toLowerCase()) ||
          customerNumber.includes(searchTerm)
        );
      });
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "1month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(bill => new Date(bill.date) >= filterDate);
    }

    // Keep the latest-first sorting after filtering
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredBills(filtered);
  };

  return {
    billsData,
    filteredBills,
    groupedBills,
    users,
    loading,
    filterBills,
    refetch: fetchBills
  };
};