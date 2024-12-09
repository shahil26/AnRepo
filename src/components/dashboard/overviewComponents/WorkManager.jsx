import { useState, useEffect, useCallback } from "react";
import { useDispatch} from "react-redux";
import { OVERVIEW_SUCCESS } from "../../../redux/actions/types";
import overviewService from "../../../services/overviewService";

const WorkManager = () => {
  const [requests, setRequests] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

// Memoize fetchWork function
const fetchWork = useCallback(async () => {
  try {
    setLoading(true);
    const [requestsData, assignedData] = await Promise.all([
      overviewService.get_requests(),
      overviewService.get_assigned()
    ]);
    
    setRequests(Array.isArray(requestsData) ? requestsData : []);
    setAssigned(Array.isArray(assignedData) ? assignedData : []);
    
    dispatch({ 
      type: OVERVIEW_SUCCESS, 
      payload: { requests: requestsData, assigned: assignedData } 
    });
  } catch (err) {
    setError("Failed to fetch work items");
    console.error("Error fetching work:", err);
  } finally {
    setLoading(false);
  }
}, [dispatch]); // Add dispatch as dependency

useEffect(() => {
  fetchWork();
}, [fetchWork]);

  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 border-black shadow-xl rounded-md p-4 overflow-auto">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Work Manager
      </h2>

      {/* Dropdown Menu */}
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        className="mb-4 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        <option value="requests">Pending Requests</option>
        <option value="assigned">Assigned Tasks</option>
      </select>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div>
          {activeTab === "requests" ? (
            requests.length > 0 ? (
              <div className="space-y-2">
                {requests.map((request, index) => (
                  <div
                    key={request.id || index}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-gray-500">
                          {request.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No pending requests</p>
            )
          ) : assigned.length > 0 ? (
            <div className="space-y-2">
              {assigned.map((task, index) => (
                <div
                  key={task.id || index}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                      <span className="text-xs text-blue-500">
                        Status: {task.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No assigned tasks</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkManager;
