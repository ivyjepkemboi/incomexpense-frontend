import React from "react";

export default function Modals({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Content Box */}
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

        {/* Modal Body */}
        <div className="text-gray-700">{children}</div>

        {/* Modal Footer (Buttons) */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
            onClick={onClose}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
