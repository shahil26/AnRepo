/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { VIS_UPDATE_SUCCESS } from "../../../redux/actions/types";
import dataService from "../../../services/dataService";

const DataModal = ({ data, onClose, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.email);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dateAdded = data.date_uploaded.split("-").reverse().join("/");
  const priority_roles = [
    "Admin",
    "Head",
    "Financial Officer",
    "Faculty",
    "Reviewer",
    "Viewer",
    "Student",
  ];
  let role;
  for (let i = 0; i < priority_roles.length; i++) {
    if (data.uploader_roles.includes(priority_roles[i])) {
      role = priority_roles[i];
      break;
    }
  }
  if (data.uploader_roles.length > 1) {
    role += " +" + (data.uploader_roles.length - 1);
  }

  const handleDelete = async () => {
    try {
      const response = await dataService.delete_data(data.file_id);
      alert(response.message);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fetchFilePreview = async () => {
      try {
        const response = await dataService.peek_data(data.file_id);
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Create a URL for the blob
        const fileUrl = URL.createObjectURL(blob);

        // Set file type and content for display
        setFileType(response.headers["content-type"]);
        if (response.headers["content-type"].startsWith("text")) {
          const textContent = await blob.text();
          setFileContent(textContent); // Store the text content
        } else {
          setFileContent(fileUrl); // Store the blob URL for other types
        }

        // Clean up the URL object when component unmounts
        return () => URL.revokeObjectURL(fileUrl);
      } catch (error) {
        console.error("Error fetching file preview", error);
      }
    };
    fetchFilePreview();
  }, [data.file_id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-2/3 max-w-4xl relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-4 border-b pb-2 flex flex-col items-center">
          <h2 className="text-xl font-bold">{data.file_name} </h2>
        </div>

        {/* Data Preview */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Data Preview:</h4>
          <div className="bg-gray-100 p-4 rounded-md overflow-y-auto h-96">
            {fileContent && fileType ? (
              fileType.startsWith("text") || fileType === "text/csv" ? (
                // For text-based files (including CSV)
                <div className="whitespace-pre-wrap text-sm text-gray-800">
                  {fileContent.split("\n").map((line, index) => (
                    <div key={index} className="py-1">
                      {line}
                    </div>
                  ))}
                </div>
              ) : fileType.startsWith("image") ? (
                // For image files
                <img
                  src={fileContent}
                  alt={data.file_name}
                  className="max-w-full h-auto"
                />
              ) : fileType === "application/pdf" ? (
                // For PDF files
                <iframe
                  src={fileContent}
                  className="w-full h-full"
                  title="File Preview"
                />
              ) : fileType ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                fileType === "application/msword" ? (
                // For Word documents (DOCX and DOC)
                <iframe
                  src={`https://docs.google.com/gview?url=${fileContent}&embedded=true`}
                  className="w-full h-full"
                  title="Word Preview"
                />
              ) : fileType ===
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
                fileType === "application/vnd.ms-powerpoint" ? (
                // For PowerPoint presentations (PPTX and PPT)
                <iframe
                  src={`https://docs.google.com/gview?url=${fileContent}&embedded=true`}
                  className="w-full h-full"
                  title="PowerPoint Preview"
                />
              ) : fileType ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                fileType === "application/vnd.ms-excel" ? (
                // For Excel spreadsheets (XLSX and XLS)
                <iframe
                  src={`https://docs.google.com/gview?url=${fileContent}&embedded=true`}
                  className="w-full h-full"
                  title="Excel Preview"
                />
              ) : (
                // For unsupported file types
                <p>Cannot preview this file type. You can download it to view.</p>
              )
            ) : (
              <p>Loading preview...</p>
            )}
          </div>
        </div>

        {/* Inline Date Added and Role */}
        <div className="flex justify-between mb-4">
          <span className="text-sm">Date Added: {dateAdded}</span>
          <span className="text-sm">Uploader Role(s): {role}</span>
        </div>

        {/* Description */}
        <div className="mb-2">
          <p className="mb-4">
            <strong>Description:</strong> {data.description}
          </p>
          <hr />
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          {/* Download button remains accessible */}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => {
              // Backend call to download the data
              dataService.download_data(data.file_id);
            }}
          >
            Download
          </button>

          {/* Conditionally render Delete and Create Visualization options */}
          {onDeleteSuccess && (
            <>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => {
                  // Backend call to create visualization
                  dispatch({ type: VIS_UPDATE_SUCCESS, payload: data });
                  navigate("/dashboard/visualization");
                }}
              >
                Create Visualization
              </button>
              {data.uploader === email && (
                confirmDelete ? (
                  <div className="flex flex-col">
                    <div className="font-semibold">Are you sure?</div>
                    <div className="flex gap-2 justify-around">
                      <button
                        className="bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600"
                        onClick={handleDelete}
                      >
                        Yes
                      </button>
                      <button
                        className="bg-gray-500 text-white py-2 px-2 rounded hover:bg-gray-600"
                        onClick={() => setConfirmDelete(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataModal;
