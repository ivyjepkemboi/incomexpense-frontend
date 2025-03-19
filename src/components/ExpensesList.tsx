import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Modal } from "./ui/modal";
import Button from "./ui/button/Button";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/api/transactions", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();
      const expenseList = transactions.filter((t) => t.type === "expense");
      setExpenses(expenseList);
      setFilteredExpenses(expenseList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = expenses;
    if (selectedCategory) {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }
    if (selectedDate) {
      filtered = filtered.filter((expense) =>
        new Date(expense.timestamp).toISOString().split("T")[0] === selectedDate
      );
    }
    setFilteredExpenses(filtered);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setFilteredExpenses(expenses);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">All Expenses</h2>
        <div className="flex gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg className="stroke-current fill-white dark:fill-gray-800" width="20" height="20" viewBox="0 0 20 20">
              <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filter Expenses</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              placeholder="Enter category"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleFilter}>
              Apply Filter
            </Button>
          </div>
        </Modal>
      )}

      {/* Expenses Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader className="border-gray-100 border-y bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Category
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Amount (Ksh)
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Date
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="px-6 py-4">{expense.category}</TableCell>
                <TableCell className="px-6 py-4">{expense.amount.toLocaleString()}</TableCell>
                <TableCell className="px-6 py-4">{new Date(expense.timestamp).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
