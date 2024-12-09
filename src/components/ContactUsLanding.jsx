/* eslint-disable react/prop-types */
import { useState } from "react";
import img from "/logo.png";
import authService from "../services/authService";

const ContactUsLanding = ({ goBack }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institute, setInstitute] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try{
      authService.send_contact(email, phone, institute);
      setSubmitted(true);
      setEmail("");
      setPhone("");
      setInstitute("");
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
        {submitted ? (
          <div className="text-center text-green-600 dark:text-green-400 text-xl flex flex-col items-center">
            <p className="mb-4 font-medium">
              Thank you for reaching out to us! Our team will review your
              message and get back to you within 24-48 hours.
            </p>
            <button
              onClick={goBack}
              className="px-6 py-3 bg-red-500 dark:bg-red-600 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-6 drop-shadow-lg">
                Get Started With AnRepo
              </h2>
              <img
                src={img}
                alt="AnRepo Logo"
                className="w-40 md:w-48 lg:w-56 object-contain mb-4"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="institute"
                  className="block text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Institute Name
                </label>
                <input
                  type="text"
                  id="institute"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your institute name"
                  required
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
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

export default ContactUsLanding;