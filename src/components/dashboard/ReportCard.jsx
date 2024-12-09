import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link} from 'react-router-dom';

const ReportCard = () => {
  const [version, setVersion] = useState("v1");
  const [searchTerm, setSearchTerm] = useState("");

  const versions = ["V1", "V2", "V3"];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
            Report Cards Dashboard
          </h1>
          <Link 
  to="create"
  className="mt-2 md:mt-0 bg-blue-600 text-white dark:text-gray-200 px-4 py-2 rounded-md hover:bg-blue-500 dark:hover:bg-blue-400 transition-all"
>
  Create New Report Card
</Link>
        </header>

        {/* Search, Sort, Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search report cards..."
              className="w-full p-3 pr-12 text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition"
            />
            <AiOutlineSearch
              className="absolute right-4 top-3 text-gray-500 dark:text-gray-400"
              size={20}
            />
          </div>

          <div className="w-full md:w-1/4">
            <select className="w-full p-3 text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition">
              <option disabled selected>Sort by</option>
              <option>Department</option>
              <option>Date Ascending</option>
              <option>Date Descending</option>
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <select className="w-full p-3 text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition">
              <option disabled selected>Filter by</option>
              <option>Department</option>
              <option>This Month</option>
              <option>This Semester</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Report Card Items */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-xl transition-transform duration-200 transform hover:scale-105"
            >
              {/* Report Card Preview */}
              <div className="mb-4">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    Preview Image
                  </span>
                </div>
              </div>

              {/* Report Card Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 dark:text-gray-300">
                    Version:
                  </label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="block w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                  >
                    {versions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 text-center">
                  <button className="w-full py-2 bg-green-100 dark:bg-green-600 dark:text-white hover:bg-green-200 dark:hover:bg-green-500 rounded-md text-green-700">
                    Download PDF
                  </button>
                  <button className="w-full py-2 bg-yellow-100 dark:bg-yellow-600 dark:text-white hover:bg-yellow-200 dark:hover:bg-yellow-500 rounded-md text-yellow-700">
                    Edit
                  </button>
                  <button className="w-full py-2 bg-purple-100 dark:bg-purple-600 dark:text-white hover:bg-purple-200 dark:hover:bg-purple-500 rounded-md text-purple-700">
                    Share
                  </button>
                  <button className="w-full py-2 bg-red-100 dark:bg-red-600 dark:text-white hover:bg-red-200 dark:hover:bg-red-500 rounded-md text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;