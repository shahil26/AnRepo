import { useState, useEffect } from 'react';
import overviewService from "../../../services/overviewService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await overviewService.get_notifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 border-black shadow-xl rounded-md p-4 overflow-auto">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Notifications
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex-grow overflow-y-auto space-y-2">
          {notifications.map((notification, index) => (
            <div 
              key={notification.id || index}
              className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-700 dark:text-gray-200">
                    {notification.message}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notification.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No notifications found
        </div>
      )}
    </div>
  );
};

export default Notifications;