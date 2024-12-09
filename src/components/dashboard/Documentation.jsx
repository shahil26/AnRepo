import { useState, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md"; 
import helpService from "../../services/helpService";
const Documentation = () => {
  const [faqData, setFaqData] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const faqResponse = await helpService.getFAQ();
        const docsResponse = await helpService.getDocs();
        const faqData = faqResponse.data.faq;
        const docsData = docsResponse.data.docs;
        setFaqData(faqData);
        setDocsData(docsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)] min-h-fit">
      {/* FAQ Section */}
      <div className="lg:w-1/2 w-full bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        {error || faqData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <MdErrorOutline className="text-gray-500 dark:text-gray-400 text-6xl mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No FAQs available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {item.question}
                  </h3>
                  <span className="text-gray-800 dark:text-gray-200 text-2xl">
                    {openQuestion === index ? "-" : "+"}
                  </span>
                </div>
                {openQuestion === index && (
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Docs Section */}
      <div className="lg:w-1/2 w-full bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 dark:text-gray-200">
          Documentation
        </h2>
        {error || docsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <MdErrorOutline className="text-gray-500 dark:text-gray-400 text-6xl mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No documents available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {docsData.map((doc, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {doc.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {doc.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;
