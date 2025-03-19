import { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "../../icons/";
import { Modal } from "../../components/ui/modal";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import RecentExpenses from "../ecommerce/RecentExpenses";
import { BASE_URL } from "../../api";

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [source, setSource] = useState("");
  const [categories, setCategories] = useState({});
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/categories`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const openModal = (type) => {
    setModalContent(type);
    setAmount("");
    setDescription("");
    setCategory("");
    setSubcategory("");
    setSource("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const input = e.target.value;
    setCategory(input);
    setDropdownOpen(true);
    if (input.trim() === "") {
      setFilteredCategories(Object.keys(categories));
    } else {
      setFilteredCategories(
        Object.keys(categories).filter((cat) =>
          cat.toLowerCase().includes(input.toLowerCase())
        )
      );
    }
  };

  const handleSubcategoryChange = (e) => {
    const input = e.target.value;
    setSubcategory(input);
    setSubcategoryDropdownOpen(true);
    if (category && categories[category]) {
      if (input.trim() === "") {
        setFilteredSubcategories(categories[category]);
      } else {
        setFilteredSubcategories(
          categories[category].filter((sub) =>
            sub.toLowerCase().includes(input.toLowerCase())
          )
        );
      }
    } else {
      setFilteredSubcategories([]);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setDropdownOpen(false);
    setFilteredSubcategories(categories[cat] || []);
  };

  const handleSubcategorySelect = (sub) => {
    setSubcategory(sub);
    setSubcategoryDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      let transactionData;

      if (modalContent === "Add Income") {
        transactionData = {
          type: "income",
          source,
          amount: parseFloat(amount),
          description,
        };
      } else {
        transactionData = {
          type: "expense",
          category,
          subcategory,
          amount: parseFloat(amount),
          description,
        };
      }

      const response = await fetch(`${BASE_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save transaction");

      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end m-4 space-x-4">
        <Button size="sm" variant="primary" startIcon={<BoxIcon className="size-5" />} onClick={() => openModal("Add Income")}>
          Add Income
        </Button>
        <Button size="sm" variant="primary" startIcon={<BoxIcon className="size-5" />} onClick={() => openModal("Add Expense")}>
          Add Expense
        </Button>
        
        
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent}>
        <p className="text-center text-lg font-semibold">{modalContent}</p>
        <div className="mt-4">
          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium">Amount</label>
            <input type="number" placeholder="Enter amount" className="w-full p-2 border rounded-md" value={amount} onChange={(e) => setAmount(e.target.value)} required />

            {modalContent === "Add Income" && (
              <>
                <label className="block mt-3 mb-2 text-sm font-medium">Source</label>
                <input type="text" placeholder="Enter source" className="w-full p-2 border rounded-md" value={source} onChange={(e) => setSource(e.target.value)} required />
              </>
            )}

            {modalContent === "Add Expense" && (
              <>
                <label className="block mt-3 mb-2 text-sm font-medium">Category</label>
                <div className="relative">
                  <input type="text" placeholder="Search or add category" className="w-full p-2 border rounded-md"
                    value={category}
                    onChange={handleCategoryChange}
                    onFocus={() => {
                      setDropdownOpen(true);
                      setFilteredCategories(Object.keys(categories));
                    }}
                  />
                  <ChevronDownIcon className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
                </div>
                {category && !categories.hasOwnProperty(category) && (
                  <p className="text-sm text-green-600 mt-1">
                    New category "<strong>{category}</strong>" will be created.
                  </p>
                )}
                {dropdownOpen && filteredCategories.length > 0 && (
                  <ul className="border rounded-md max-h-40 overflow-y-auto mt-1">
                    {filteredCategories.map((cat) => (
                      <li key={cat} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleCategorySelect(cat)}>
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}

                <label className="block mt-3 mb-2 text-sm font-medium">Subcategory</label>
                <div className="relative">
                  <input type="text" placeholder="Search or add subcategory" className="w-full p-2 border rounded-md" value={subcategory} onChange={handleSubcategoryChange}
                    onFocus={() => {
                      setSubcategoryDropdownOpen(true);
                      if (category && categories[category]) {
                        setFilteredSubcategories(categories[category]);
                      }
                    }}
                  />
                  <ChevronDownIcon className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
                </div>
                {subcategory && category && categories[category] && !categories[category].includes(subcategory) && (
                  <p className="text-sm text-green-600 mt-1">
                    New subcategory "<strong>{subcategory}</strong>" will be created under "<strong>{category}</strong>".
                  </p>
                )}
                {subcategoryDropdownOpen && filteredSubcategories.length > 0 && (
                  <ul className="border rounded-md max-h-40 overflow-y-auto mt-1">
                    {filteredSubcategories.map((sub) => (
                      <li key={sub} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSubcategorySelect(sub)}>{sub}</li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <label className="block mt-3 mb-2 text-sm font-medium">Description</label>
            <textarea placeholder="Enter description" className="w-full p-2 border rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="sm" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </div>
      </Modal>
      
    </>
  );
}
