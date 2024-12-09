import { useState } from "react";
import helpService from "../../services/helpService";
import img from "/logo.png";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !details.trim()) {
      alert('Subject and details are required');
      return;
    }
  
    const formData = new FormData();
  
  
    // Add email body as string
    formData.append('subject', subject);
    formData.append('body', details);
  
    // File handling with validation
    if (image) {
      // Validate file size (e.g., 5MB limit)
      if (image.size > 5 * 1024 * 1024) {
        alert('File size too large');
        return;
      }
      formData.append('file', image);
    }
  
    try {
      const response = await helpService.contact(formData);
      
      if (response.status === 200) {
        setSubmitted(true);
        // Reset form
        setSubject('');
        setDetails('');
        setImage(null);
      } else {
        throw new Error(response.message || 'Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCloseMessage = () => {
    setSubmitted(false);
  };

  return (
    <div className="p-4 dark:bg-black flex justify-center items-center h-[calc(100vh-5rem)] min-h-fit">
      <div className="w-full max-w-4xl dark:bg-gray-800 border-2 border-black shadow-xl rounded-md p-6 overflow-auto flex items-center justify-center dark:border-white">
        {/* Contact Us Container */}
        {submitted ? (
          // Success message after submission
          <div className="text-center text-green-600 dark:text-green-400 text-xl flex flex-col items-center">
            <p>
              Thank you for reaching out to us! Our team will review your
              message and get back to you within 24-48 hours.
            </p>
            <button
              onClick={handleCloseMessage}
              className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex justify-center">
              <img
                src={img}
                alt="AnRepo Logo"
                className="w-full h-auto max-w-[250px] md:max-w-[300px] lg:max-w-[350px] object-contain"
              />
            </div>

            {/* Right Section - Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md w-full"
            >
              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 dark:text-gray-300 font-medium"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 p-2 block w-full border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the subject"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="details"
                  className="block text-gray-700 dark:text-gray-300 font-medium"
                >
                  Details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows="4"
                  className="mt-1 p-2 block w-full border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the details"
                  style={{
                    resize: "vertical",
                    minHeight: "100px",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label
                  htmlFor="image-upload"
                  className="block text-gray-700 dark:text-gray-300 font-medium"
                >
                  Supporting files
                </label>
                <input
                  type="file"
                  id="image-upload"
                  onChange={handleImageUpload}
                  className="mt-2 block w-full text-gray-700 dark:text-gray-200"
                />
                {image && (
                  <div className="mt-2 text-gray-700 dark:text-gray-300">
                    <p>Uploaded file: {image.name}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;