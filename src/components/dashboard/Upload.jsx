import { useState, useMemo, useEffect,useCallback } from "react";
import DataUpload from "./dataComponents/DataUpload";
import DataCard from "../dashboard/dataComponents/DataCard";
import DataModal from "./dataComponents/DataModal"; // Import DataModal for displaying selected data
import dataService from "../../services/dataService";

const Upload = () => {
  // State variables
  const [selectedData, setSelectedData] = useState(null); // To hold the selected data item for the modal
  const [filterRole, setFilterRole] = useState(""); // To filter data by role
  const [dateFilter, setDateFilter] = useState(""); // To filter data by date
  const [fileTypeFilter, setFileTypeFilter] = useState(""); // To filter data by file type
  const [sortOption, setSortOption] = useState("date_added_desc"); // Sorting option for data
  const [data, setData] = useState([]); // Store the fetched data from the backend
  const [dataLength, setDataLength] = useState(0); // To track the number of data items
  const [isModalOpen, setIsModalOpen] = useState(false); // To control the visibility of the modal

  // Function to fetch data

  const fetchData = useCallback(async () => {
    try {
      const result = await dataService.get_data(); // Fetch data using the service
      //for each data if is_deleted is true then dont show that data
      result.files_meta_data = result.files_meta_data.filter((data) => !data.is_deleted);
      setData(result.files_meta_data); // Set the fetched data
      setDataLength(result.files_meta_data.length); // Update the length of data
    } catch (error) {
      console.error("Error fetching data:", error); // Handle error
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [fetchData]); // Call fetchData when the component mounts

  const handleUploadSuccess = () => {
    fetchData(); // Re-fetch data on successful upload
  };
  const handleDeleteSuccess = () => {
    fetchData(); // Re-fetch data on successful upload
  };

  // Handle the selection of a data card, open the modal, and pass the selected data
  const handleSelect = (dataItem) => {
    setSelectedData(dataItem); // Set the selected data
    setIsModalOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedData(null); // Reset the selected data
  };

  const priority_roles = useMemo(() => ["Admin", "Head", "Financial Officer", "Faculty", "Reviewer", "Viewer", "Student"], []);

  // Use useMemo to avoid re-calculating filtered/sorted data on every render unless dependencies change
  const filteredData = useMemo(() => {
    let filtered = [...data]; // Start with all the data

    // Filter by role
    if (filterRole) {
      filtered = filtered.filter((d) => d.uploader_roles.includes(filterRole));
    }
    if (fileTypeFilter) {
      filtered = filtered.filter((d) => d.file_type === fileTypeFilter);
    }
    // Filter by date
    const today = new Date();
    if (dateFilter === "today") {
      filtered = filtered.filter((d) => {
        const date = new Date(d.date_uploaded.split("T")[0]);
        return date.toDateString() === today.toDateString();
      });
    } else if (dateFilter === "this_week") {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7); // Set to 7 days before today

      filtered = filtered.filter((d) => {
        const date = new Date(d.date_uploaded.split("T")[0]);
        return date >= sevenDaysAgo && date <= today;
      });
    } else if (dateFilter === "this_month") {
      filtered = filtered.filter((d) => {
        const date = new Date(d.date_uploaded.split("T")[0]);
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      });
    } else if (dateFilter === "this_year") {
      filtered = filtered.filter((d) => {
        const date = new Date(d.date_uploaded.split("T")[0]);
        return date.getFullYear() === today.getFullYear();
      });
    }

    // Sorting logic
    filtered.sort((a, b) => {
      // Sort by priority first
      const priorityA = priority_roles.indexOf(a.uploader_roles[0]) !== -1 ? 
                        priority_roles.indexOf(a.uploader_roles[0]) : priority_roles.length;
      const priorityB = priority_roles.indexOf(b.uploader_roles[0]) !== -1 ? 
                        priority_roles.indexOf(b.uploader_roles[0]) : priority_roles.length;

      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Prioritize the roles
      }

      // Then sort by date
      const dateA = new Date(a.date_uploaded); // Create a Date object for a
      const dateB = new Date(b.date_uploaded); // Create a Date object for b

      if (sortOption === "date_added_asc") {
        return dateA - dateB; // Sort in ascending order
      } else if (sortOption === "date_added_desc") {
        return dateB - dateA; // Sort in descending order
      }

      return 0; // Default case
    });
    
    return filtered;
  }, [filterRole, dateFilter, fileTypeFilter,sortOption, data, priority_roles]); // Re-run when these dependencies change

  return (
    <div className="mx-auto mt-4 lg:mt-8">
      {/* Main layout section */}
      <div className="p-4 flex laptop:flex-row flex-col laptop:gap-8">
        {/* Upload Data Section */}
        <div className="w-full lg:w-1/2">
          <DataUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Raw Data Section */}
        <div className="w-full mb-8 shadow-xl h-fit min-h-[80vh] lg:w-1/2 rounded-lg bg-gray-100 p-5">
          <h2 className="text-xl font-bold mb-4 text-center">Raw Data ({dataLength})</h2>
          
          {/* Filters and Sorting UI */}
          <div className="flex gap-4 mb-6 justify-center">
            {/* Filter by Role */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)} // Update role filter
              className="p-2 border rounded w-1/4"
            >
              <option value="">All Roles</option>
              {priority_roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {/* Filter by File Type */}
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)} // Update file type filter
              className="p-2 border rounded w-1/4"
            >
              <option value="">All Types</option>
              <option value="Financial">Financial</option>
              <option value="Trends">Trends</option>
              <option value="Descriptive">Descriptive</option>
              <option value="Achievements">Achievements</option>
              <option value="Facilities">Facilities</option>
              <option value="Informative">Informative</option>
            </select>
            {/* Filter by Date */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} // Update date filter
              className="p-2 border rounded w-1/4"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
            </select>

            {/* Sort by Option */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)} // Update sorting option
                className="p-2 border rounded w-1/4"
              >
                <option value="date_added_desc">Latest</option>
                <option value="date_added_asc">Oldest</option>
                <option value="priority">By Priority</option>
              </select>
          </div>

          {/* Data Cards */}
          <div className="overflow-y-auto mt-4 flex-1 h-[60vh]">
          {filteredData.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <h3 className="text-2xl laptop:text-4xl">No data found</h3>
            </div>
          ) : (
            filteredData.map((dataItem, index) => (
              <DataCard
                key={index}
                data={{
                  ...dataItem,
                  date_uploaded: dataItem.date_uploaded.split("T")[0],
                }}
                onSelect={handleSelect}
              />
            ))
          )}
          </div>
        </div>
      </div>

      {/* Data Modal */}
      {isModalOpen && selectedData && (
        <DataModal data={selectedData} onClose={handleClose} onDeleteSuccess={handleDeleteSuccess} /> // Show modal with selected data
      )}
    </div>
  );
};

export default Upload;
