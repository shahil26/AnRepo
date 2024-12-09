/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Select, Option } from "@material-tailwind/react";
import dataService from "../../../services/dataService";

const DataUpload = ({ onUploadSuccess }) => {
  const titleElement = useRef();
  const descriptionElement = useRef();
  const fileElement = useRef();
  const [sortOption, setSortOption] = useState("Informative");
  const [selectedFile, setSelectedFile] = useState("");

  const roles = [
    "Head",
    "Faculty",
    "Student",
    "Financial Officer",
  ];

  const [selectedRoles, setSelectedRoles] = useState([...roles]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleRoleChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedRoles((prevRoles) => [...prevRoles, value]);
    } else {
      setSelectedRoles((prevRoles) => prevRoles.filter((role) => role !== value));
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
    } else {
      setSelectedFile("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "text/csv",
      "application/msword", // DOC
      "application/vnd.ms-powerpoint", // PPT
      "application/vnd.ms-excel", // XLS
      "image/jpeg", // JPG
      "image/jpg", // JPG
      "image/png", // PNG
      "image/gif", // GIF
      "image/svg+xml", // SVG
      "image/webp" // WEBP
    ];
    
    const file = fileElement.current.files[0];
    if (file.size > 20 * 1024 * 1024) {
      alert("File size should not exceed 20MB.");
      return;
    }

    if (
      !titleElement.current.value ||
      titleElement.current.value.length > 30 ||
      !descriptionElement.current.value ||
      !file ||
      selectedRoles.length === 0
    ) {
      if (!titleElement.current.value) {
        alert("Title is required");
      } else if (titleElement.current.value.length > 30) {
        alert("Title must be less than 30 characters");
      } else if (!descriptionElement.current.value) {
        alert("Description is required");
      } else if (!file) {
        alert("Please select a file to upload");
      } else if (selectedRoles.length === 0) {
        alert("Please select at least one role");
      }
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      alert("Only PDF, DOCX, PPT, XLSX, CSV, and image files (JPG, JPEG, PNG, GIF, SVG, WEBP) are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleElement.current.value);
    formData.append("file_type", sortOption);
    formData.append("description", descriptionElement.current.value);
    formData.append("file", file);
    formData.append("access_roles", selectedRoles);
    try {
      await dataService.upload_data(formData);
      alert("Data uploaded successfully");
      onUploadSuccess();
      titleElement.current.value = "";
      descriptionElement.current.value = "";
      fileElement.current.value = "";
      setSelectedFile("");
    } catch (e) {
      alert("Error uploading data", e);
    }
  };

  return (
    <div className="p-4 shadow-xl rounded-lg mb-6 mt-6 mobile:mt-0 h-fit min-h-[80vh] laptop:w-full lg:w-full bg-gray-100">
      <h2 className="text-xl font-bold mb-9 text-center">Upload Data</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          ref={titleElement}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 mb-4 border rounded h-24"
          ref={descriptionElement}
        ></textarea>

        <div className="flex justify-between gap-4">
          {/* Access Roles Dropdown */}
          <div className="relative w-1/2">
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full p-2 border rounded transparent border-gray-400"
            >
              {selectedRoles.length === 0
                ? "Select Data Access Roles"
                : `${selectedRoles.length} Access Roles Selected`}
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full border bg-white shadow-lg rounded-md">
                {roles.map((role) => (
                  <label key={role} className="block p-2">
                    <input
                      type="checkbox"
                      value={role}
                      checked={selectedRoles.includes(role)}
                      onChange={handleRoleChange}
                      className="mr-2"
                    />
                    {role}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Data Type Select */}
          <div className="w-1/2">
            <Select label="Data Type" value={sortOption} onChange={(val) => setSortOption(val)}>
              <Option value="Financial">Financial</Option>
              <Option value="Trends">Trends</Option>
              <Option value="Descriptive">Descriptive</Option>
              <Option value="Achievements">Achievements</Option>
              <Option value="Facilities">Facilities</Option>
              <Option value="Informative">Informative</Option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center w-full py-2">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500" // Adjusted height for the upload box
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="p-2 text-xs text-gray-500 dark:text-gray-400">
              PDF, DOCX, PPT, XLSX, CSV, and image files (JPG, JPEG, PNG, GIF, SVG, WEBP) (MAX. 20MB)
              </p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              name="file" 
              className="hidden" 
              ref={fileElement} 
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Display selected file name */}
        {selectedFile && (
          <div className="text-center text-sm text-gray-600">
            Selected file: <span className="font-semibold">{selectedFile}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataUpload;
