/* eslint-disable react/prop-types */
import { useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [requestText, setRequestText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!requestText || !selectedRole) {
      alert("Please fill out both fields.");
      return;
    }
    onSubmit(requestText, selectedRole); // Pass data back to the parent component
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Request Access</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter your request text here"
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)} // Update the state
        />
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)} // Update the state
        >
          <option value="">Select a Role</option>
          <option value="Admin">Admin</option>
          <option value="Dept. Head">Dept. Head</option>
          <option value="Faculty">Faculty</option>
          <option value="Student">Student</option>
          <option value="Financial Officer">Financial Officer</option>
          <option value="Report Reviewer">Report Reviewer</option>
          <option value="Viewer">Viewer</option>
        </select>
        <div className="flex justify-end">
          <button className="bg-gray-300 py-2 px-4 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
