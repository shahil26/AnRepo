import { useState, useEffect } from 'react';
import overviewService from "../../../services/overviewService";

const Recents = () => {
  const [recents, setRecents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecents = async () => {
      try {
        setIsLoading(true);
        const data = await overviewService.get_recents();
        setRecents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch recents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecents();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-7)] border-2 border-black shadow-xl rounded-md p-4 overflow-auto">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Recents
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : recents.length > 0 ? (
        <div className="space-y-4">
          {recents.map((item, index) => (
            <div 
              key={item.id || index}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {item.type}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.message}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No recent items found
        </div>
      )}
    </div>
  );
};

export default Recents;