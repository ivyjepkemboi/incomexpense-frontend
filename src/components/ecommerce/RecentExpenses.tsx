import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubcategory, setEditSubcategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [categories, setCategories] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
const [filteredCategories, setFilteredCategories] = useState([]);
const [filteredSubcategories, setFilteredSubcategories] = useState([]);


  const navigate = useNavigate();

  const handleEditCategoryChange = (e) => {
    setEditCategory(e.target.value);
  };

  const handleEditSubcategoryChange = (e) => {
    setEditSubcategory(e.target.value);
  };

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
      const expenseList = transactions.filter((t) => t.type === "expense").slice(0, 5);
      setExpenses(expenseList);
      setFilteredExpenses(expenseList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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

   // ✅ Fetch categories from API
   const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/api/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data); // ✅ Store categories
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setEditCategory(expense.category);
    setEditSubcategory(expense.subcategory || ""); // Ensure no errors if subcategory is missing
    setEditTitle(expense.title);
    setEditAmount(expense.amount);
    setEditDescription(expense.description || ""); // Ensure no errors if description is missing
    setIsEditModalOpen(true);
  };
  

  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault(); // Prevent form from submitting normally
  
    if (!editCategory || !editTitle || !editAmount) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/api/transactions/${selectedExpense.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: editCategory,
          subcategory: editSubcategory || "", // Ensure it exists
          title: editTitle,
          amount: parseFloat(editAmount),
          description: editDescription || "", // Ensure it exists
        }),
      });
  
      const data = await response.json();
      console.log("Update Response:", data); // Debugging log
  
      if (!response.ok) {
        throw new Error(data.error || "Update failed!");
      }
  
      // Refresh expenses list
      await fetchExpenses();
      setIsEditModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  

  const handleDeleteExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/api/transactions/${selectedExpense.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Delete failed!");
      }

      fetchExpenses();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };
  

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Expenses</h3>
        <div className="flex items-center gap-3">
          <button size="sm" variant="secondary" onClick={() => setIsFilterModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" size="sm" variant="primary" onClick={() => navigate("/expenses")}>
            See all
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center mt-3">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-3">{error}</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Amount (Ksh)
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center py-3 text-gray-500">
                    No expenses recorded.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {expense.category}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(expense.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => handleEditClick(expense)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteClick(expense)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filter Expenses">
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
            <Button variant="outline" size="sm" onClick={() => setIsFilterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleFilter}>
              Apply Filter
            </Button>
          </div>
        </Modal>
      )}

                {/* Edit Expense Modal */}
          {selectedExpense && (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Expense">
    <form onSubmit={handleUpdateExpense}>
      {/* Category Input */}
      {/* Category Input */}
<label className="block mt-3 mb-2 text-sm font-medium">Category</label>
<div className="relative">
  <input
    type="text"
    placeholder="Search or add category"
    className="w-full p-2 border rounded-md"
    value={editCategory}
    onChange={(e) => {
      setEditCategory(e.target.value);
      setFilteredCategories(
        Object.keys(categories).filter((cat) =>
          cat.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setDropdownOpen(true); // Show dropdown when typing
    }}
    onFocus={() => {
      setDropdownOpen(true);
      setFilteredCategories(Object.keys(categories)); // Populate dropdown
    }}
    onBlur={() => {
      setTimeout(() => setDropdownOpen(false), 200); // Close dropdown after selection
    }}
  />
  <ChevronDownIcon className="absolute top-3 right-3 h-5 w-5 text-gray-500 cursor-pointer"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  />
</div>

{/* Dropdown List */}
{dropdownOpen && filteredCategories.length > 0 && (
  <ul className="absolute z-10 bg-white border rounded-md max-h-40 overflow-y-auto mt-1 w-full shadow-lg">
    {filteredCategories.map((cat) => (
      <li key={cat} className="p-2 hover:bg-gray-200 cursor-pointer"
        onMouseDown={() => {
          setEditCategory(cat);
          setDropdownOpen(false);
        }}>
        {cat}
      </li>
    ))}
  </ul>
)}


      {/* Subcategory Input */}
      <label className="block mt-3 mb-2 text-sm font-medium">Subcategory</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search or add subcategory"
          className="w-full p-2 border rounded-md"
          value={editSubcategory}
          onChange={handleEditSubcategoryChange}
          onFocus={() => {
            setSubcategoryDropdownOpen(true);
            if (editCategory && categories[editCategory]) {
              setFilteredSubcategories(categories[editCategory]);
            }
          }}
        />
        <ChevronDownIcon className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
      </div>
      {editSubcategory && editCategory && categories[editCategory] && !categories[editCategory].includes(editSubcategory) && (
        <p className="text-sm text-green-600 mt-1">
          New subcategory "<strong>{editSubcategory}</strong>" will be created under "<strong>{editCategory}</strong>".
        </p>
      )}
      {subcategoryDropdownOpen && filteredSubcategories.length > 0 && (
        <ul className="border rounded-md max-h-40 overflow-y-auto mt-1">
          {filteredSubcategories.map((sub) => (
            <li key={sub} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleEditSubcategorySelect(sub)}>
              {sub}
            </li>
          ))}
        </ul>
      )}

      {/* Title Input */}
      <label className="block mt-3 mb-2 text-sm font-medium">Title</label>
      <input
        className="w-full p-2 border rounded-md"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Title"
      />

      {/* Amount Input */}
      <label className="block mt-3 mb-2 text-sm font-medium">Amount</label>
      <input
        className="w-full p-2 border rounded-md"
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
        placeholder="Amount"
      />

      {/* Description Input */}
      <label className="block mt-3 mb-2 text-sm font-medium">Description</label>
      <textarea
        placeholder="Enter description"
        className="w-full p-2 border rounded-md"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          Save
        </Button>
      </div>
    </form>
  </Modal>
)}

        

          {/* Delete Confirmation Modal */}
          {selectedExpense && (
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
              <p className="mb-4">Are you sure you want to delete this expense?</p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeleteExpense}>
                  Delete
                </Button>
              </div>
            </Modal>
          )}
    </div>
  );
}
