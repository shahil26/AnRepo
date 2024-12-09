import { useState } from "react";
import notificationService from "../../services/notificationService";

const Notify = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [groupNotificationMessage, setGroupNotificationMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [department, setDepartment] = useState("");
  const [sendToRole, setSendToRole] = useState(false);
  const [sendToDepartment, setSendToDepartment] = useState(false);

  const handleSendNotification = async () => {
    if (notificationMessage && notificationEmail) {
      const payload = {
        message: notificationMessage,
        email: notificationEmail,
      };

      try {
       await notificationService.send_single_notification(payload);
         alert("Notification sent successfully!");
        setNotificationMessage("");
        setNotificationEmail("");

      } catch (error) {
        console.error("Error sending notification:", error);
        alert("An error occurred while sending the notification.");
      }
    } else {
      alert("Please fill in both the message and email address.");
    }
  };

  const handleSendGroupNotification = async () => {
    if (groupNotificationMessage && (sendToRole || sendToDepartment)) {
      const payload = {
        message: groupNotificationMessage,
        role: sendToRole ? selectedRole : null,
        department: sendToDepartment ? department : null,
      };

      try {
        await notificationService.send_group_notification(payload);
          alert("Group notification sent successfully!");
          setGroupNotificationMessage("");
          setSelectedRole("");
          setDepartment("");
          setSendToRole(false);
          setSendToDepartment(false);
      } catch (error) {
        console.error("Error sending group notification:", error);
        alert("An error occurred while sending the group notification.");
      }
    } else {
      alert("Please fill in the message and select a role or department.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Send Notification Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Send Notification
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300">Message</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your message"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              ></textarea>
            </div>
            <label className="block text-gray-600 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              onClick={handleSendNotification}
              className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-500 dark:hover:bg-blue-600"
            >
              Send Notification
            </button>
          </div>
        </div>

        {/* Send Group Notification Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Send Group Notification
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300">Message</label>
              <textarea
                value={groupNotificationMessage}
                onChange={(e) => setGroupNotificationMessage(e.target.value)}
                placeholder="Enter your message"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              ></textarea>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendToRole}
                onChange={() => setSendToRole(!sendToRole)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-300">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={!sendToRole}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="">Select a Role</option>
                  {["Admin", "Dept. Head", "Faculty", "Student", "Financial Officer", "Report Reviewer", "Viewer"].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendToDepartment}
                onChange={() => setSendToDepartment(!sendToDepartment)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-300">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter department"
                  disabled={!sendToDepartment}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            <button
              onClick={handleSendGroupNotification}
              className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-500 dark:hover:bg-blue-600"
            >
              Send Group Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;