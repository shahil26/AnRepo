import { useState, useEffect } from "react";
import helpService from "../../services/helpService";

const ChatWithAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleTextInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSendMessage = async () => {
    if (inputValue.trim() || image) {
      try {
        setIsLoading(true);
        
        // Create FormData
        const formData = new FormData();
        if(!inputValue.trim()) {
          // Add a placeholder message if no text
          formData.append('message', 'Image uploaded');
        } else { 
        formData.append('message', inputValue.trim());
        }
        
        // Safely handle image
        let imageUrl = null;
        if (image && (image instanceof Blob || image instanceof File)) {
          // Validate image type
          if (!image.type.startsWith('image/')) {
            throw new Error('Please upload an image file');
          }
          // Append image with correct field name to match FastAPI endpoint
          formData.append('image', image);
          imageUrl = URL.createObjectURL(image);
        }
        
        // Add user message immediately
        const userMessage = {
          type: image ? "image" : "text",
          content: image ? imageUrl : inputValue,
          sender: "user",
        };
        setMessages(prev => [...prev, userMessage]);
  
        // Make API call
        const response = await helpService.chat(formData);
  
        // Add assistant response
        const assistantMessage = {
          type: "text",
          content: response || "Sorry, I couldn't process that request.",
          sender: "assistant",
        };
        setMessages(prev => [...prev, assistantMessage]);
  
        // Cleanup
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
  
        // Clear input
        setInputValue("");
        setImage(null);
        
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error to user
        setMessages(prev => [...prev, {
          type: "text",
          content: "Failed to send message. Please try again.",
          sender: "system"
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Also update image preview handling
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const imageUrl = URL.createObjectURL(file);
        setImage(file); // Store the file object
        setPreviewUrl(imageUrl); // New state for preview
      } catch (error) {
        console.error('Error creating image preview:', error);
      }
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const handleCancelImage = () => {
    setImage(null);
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-5rem)] w-screen bg-gray-50 dark:bg-black min-h-fit">
      {/* Chat Container */}
      <div className="flex flex-col h-[80vh] mx-auto border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800" style={{ width: "80%" }}>
          
          {/* Chat Header */}
          <div className="text-xl font-bold bg-blue-500 text-white p-4 shadow-md flex items-center justify-between rounded-t-lg">
            <span>Chat with Assistant</span>
            <span className="text-sm">We&apos;re here to help!</span>
          </div>
  
          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  } rounded-lg p-3 max-w-xs shadow-lg transition duration-200 ease-in-out ${
                    message.sender === "user"
                      ? "hover:bg-blue-600"
                      : "hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  {message.type === "image" ? (
                    <img src={message.content} alt="User uploaded" className="max-w-full rounded" />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
  
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-300 bg-white dark:bg-gray-800">
            {image && (
              <div className="mb-2 relative inline-block">
                <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded" />
                <button
                  onClick={handleCancelImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleTextInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                disabled={isLoading}
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputValue.trim() && !image)}
                className={`p-2 rounded-lg ${
                  isLoading || (!inputValue.trim() && !image)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition duration-200`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ChatWithAssistant;