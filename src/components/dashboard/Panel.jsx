import { useState, useEffect } from "react";
import panelService from "../../services/panelService";

const Panel = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionType, setActionType] = useState("grant");
  const [accessType, setAccessType] = useState("individual");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await panelService.list_requests();
        setAccessRequests(requestsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequest = async (id, action) => {
    try {
      if(action === "accepted") {
        await panelService.approve_request(id);
      }
      else {
        await panelService.disapprove_access(id);
      }
      setAccessRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: action } : request
        )
      );
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    try {
      if (actionType === "grant") {
        await panelService.add_access_roles({
          email,
          role,
          accessType,
        });
      } else {
        await panelService.modify_access_roles({
          email,
          role,
          accessType,
        });
      }
      // Reset form
      setEmail("");
      setRole("");
      // Refresh data
      const updatedData = await panelService.list_requests();
      setAccessRequests(updatedData);
    } catch (err) {
      console.error(`Failed to ${actionType} access:`, err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Access to Email Section */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Access Management</h2>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setActionType("grant")}
                className={`px-4 py-2 rounded ${
                  actionType === "grant"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Grant Access
              </button>
              <button
                type="button"
                onClick={() => setActionType("modify")}
                className={`px-4 py-2 rounded ${
                  actionType === "modify"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Modify Access
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setAccessType("individual")}
                className={`px-4 py-2 rounded ${
                  accessType === "individual"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Individual Access
              </button>
              <button
                type="button"
                onClick={() => setAccessType("domain")}
                className={`px-4 py-2 rounded ${
                  accessType === "domain"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Domain Access
              </button>
            </div>

            <div>
              <label className="block mb-2">
                {accessType === "individual" ? "Email Address" : "Domain"}:
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  accessType === "individual"
                    ? "Enter email address"
                    : "Enter domain (e.g., @example.com)"
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="dept_head">Dept. Head</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
                <option value="financial_officer">Financial Officer</option>
                <option value="reviewer">Report Reviewer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!email || !role}
            >
              {actionType === "grant" ? "Grant" : "Modify"} Access
            </button>
          </form>
        </div>

        {/* Access Requests Section */}
        {/* Access Requests Section */}
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
    Access Requests
  </h3>
  {isLoading ? (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  ) : accessRequests.length > 0 ? (
    <div className="space-y-4 mt-4">
      {accessRequests.map((request) => (
        <div
          key={request.id}
          className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
        >
          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {request.email}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Role: {request.role}
            </span>
          </div>
          <div className="flex space-x-2">
            {request.status === "pending" ? (
              <>
                <button
                  onClick={() => handleRequest(request.id, "accepted")}
                  className="bg-green-600 dark:bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-500 dark:hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request.id, "rejected")}
                  className="bg-red-600 dark:bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </>
            ) : (
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  request.status === "accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      No access requests found
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Panel;
