import { useSelector } from "react-redux"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import ContactUsLanding from "./ContactUsLanding"
import { FaChartBar, FaFileExport, FaLock } from "react-icons/fa"
import {
  FaRobot,
  FaClipboardList,
  FaFolderOpen,
  FaTasks,
  FaChartPie,
  FaLayerGroup,
  FaSlidersH,
  FaQuestionCircle,
  FaUniversity,
} from "react-icons/fa"
import { MdOutlineViewInAr } from "react-icons/md"
import { AiOutlineFileSearch } from "react-icons/ai"

const featureData = [
  {
    title: "AI-Driven Annual Report",
    description:
      "Leverage AI to automatically generate insightful and accurate annual reports.",
    icon: <FaRobot />,
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
    hoverTextColor: "text-blue-600",
  },
  {
    title: "Report Card",
    description: "Generate detailed report cards for performance tracking.",
    icon: <FaClipboardList />,
    iconColor: "bg-green-100",
    iconTextColor: "text-green-600",
    hoverTextColor: "text-green-600",
  },
  {
    title: "Integrated Documents",
    description: "Manage and access all documents in one place.",
    icon: <FaFolderOpen />,
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-600",
    hoverTextColor: "text-yellow-600",
  },
  {
    title: "Integrated Work Manager",
    description: "Organize and manage tasks with ease using the work manager.",
    icon: <FaTasks />,
    iconColor: "bg-teal-100",
    iconTextColor: "text-teal-600",
    hoverTextColor: "text-teal-600",
  },
  {
    title: "Full Overview",
    description:
      "Get a comprehensive overview of data insights and activities.",
    icon: <FaChartPie />,
    iconColor: "bg-red-100",
    iconTextColor: "text-red-600",
    hoverTextColor: "text-red-600",
  },
  {
    title: "RBAC",
    description:
      "Role-Based Access Control for secure and efficient management.",
    icon: <FaLock />,
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-600",
    hoverTextColor: "text-purple-600",
  },
  {
    title: "Interactive Visualizations",
    description: "Visualize data interactively for deeper insights.",
    icon: <MdOutlineViewInAr />,
    iconColor: "bg-indigo-100",
    iconTextColor: "text-indigo-600",
    hoverTextColor: "text-indigo-600",
  },
  {
    title: "Single Page",
    description: "Access everything on a single page for quick navigation.",
    icon: <AiOutlineFileSearch />,
    iconColor: "bg-orange-100",
    iconTextColor: "text-orange-600",
    hoverTextColor: "text-orange-600",
  },
  {
    title: "Admin Control Panel",
    description: "Manage user access and control panel settings effectively.",
    icon: <FaLayerGroup />,
    iconColor: "bg-teal-100",
    iconTextColor: "text-teal-600",
    hoverTextColor: "text-teal-600",
  },
  {
    title: "Personalized Settings",
    description:
      "Customize your settings and preferences for a personalized experience.",
    icon: <FaSlidersH />,
    iconColor: "bg-pink-100",
    iconTextColor: "text-pink-600",
    hoverTextColor: "text-pink-600",
  },
  {
    title: "Easy and AI-Driven Help",
    description: "Get assistance easily with AI-driven help and support.",
    icon: <FaQuestionCircle />,
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-600",
    hoverTextColor: "text-yellow-600",
  },
  {
    title: "Multi-Institute Support",
    description: "Manage and support multiple institutes seamlessly.",
    icon: <FaUniversity />,
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-600",
    hoverTextColor: "text-blue-600",
  },
]

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    setShowContactForm(true)
  }

  return (
    <>
      {showContactForm ? (
        <ContactUsLanding goBack={() => setShowContactForm(false)} /> // Pass goBack function
      ) : (
        <div className="bg-gray-100 dark:bg-gray-900 font-sans">
          <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  <img src="/logo.png" alt="Logo" />
                </div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  AnRepo
                </span>
              </div>
              <div
                className={`${
                  isOpen ? "flex" : "hidden"
                } md:flex flex-col md:flex-row items-center justify-center md:justify-end space-y-4 md:space-y-0 md:space-x-6 font-medium fixed inset-0 bg-black bg-opacity-90 dark:bg-opacity-90 p-6 md:p-0 z-40 md:z-auto transition-all duration-500 ease-in-out w-full h-full md:relative md:bg-transparent`}
              >
                <a
                  href="#features"
                  className="text-white md:text-gray-800 dark:md:text-white  dark:hover:text-blue-400 md:hover:text-blue-600 text-xl transition-colors duration-300"
                >
                  About Us
                </a>
                <a
                  href="#additional-features"
                  className="text-white md:text-gray-800 dark:md:text-white dark:hover:text-blue-400 md:hover:text-blue-600 text-xl transition-colors duration-300"
                >
                  Features
                </a>
                <a
                  href="#contact"
                  className="text-white md:text-gray-800 dark:md:text-white dark:hover:text-blue-400 md:hover:text-blue-600 text-xl transition-colors duration-300"
                >
                  Contact
                </a>
                <a
                  href="/login"
                  className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-6 rounded-full hover:bg-blue-600 dark:hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300"
                >
                  Login
                </a>
              </div>

              <div className="md:hidden relative">
                <button
                  onClick={toggleMenu}
                  className="text-gray-800 dark:text-white focus:outline-none transform transition-transform duration-300 relative top-0 right-0  p-2 z-50"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </nav>

          <section className="relative h-screen overflow-hidden">
            <video
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="hero1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-10"></div>

            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce dark:text-gray-100">
                Welcome to Our Portal
              </h1>
              <p className="text-lg md:text-2xl max-w-2xl mb-8 animate-pulse dark:text-gray-300">
                Explore the features and benefits of our system with automated
                and accurate reporting.
              </p>
              <div className="space-x-4">
                <a
                  href="#contact"
                  className="bg-blue-500 dark:bg-blue-700 text-white py-3 px-8 rounded-full hover:bg-blue-600 dark:hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300"
                  onClick={handleContactClick}
                >
                  Contact Us
                </a>
                <a
                  href="#additional-features"
                  className="bg-transparent border border-white dark:border-gray-300 py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-100 dark:hover:text-blue-700 transition-transform transform hover:scale-105 duration-300"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="py-16 bg-gray-50 dark:bg-gray-900 text-center text-gray-800 dark:text-gray-100 scroll-mt-20"
          >
            <h2 className="text-4xl font-extrabold mb-8 tracking-wide text-gray-800 dark:text-gray-100">
              Why Choose Us
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-12">
              Discover how our platform simplifies data management and reporting
              with advanced features tailored to your needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 p-8 hover:shadow-xl transition duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                    <FaChartBar className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-white">
                    Intuitive Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 group-hover:text-gray-200">
                    Get a clear and concise overview of your data with real-time
                    insights and easy navigation.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 p-8 hover:shadow-xl transition duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-700 text-teal-600 dark:text-teal-300 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                    <FaFileExport className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-white">
                    Multi-Format Export
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 group-hover:text-gray-200">
                    Export your reports in PDF, Excel, and Word formats with
                    just one click, ensuring compatibility and ease of sharing.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 p-8 hover:shadow-xl transition duration-500 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-700 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                    <FaLock className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-white">
                    Secure & Reliable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 group-hover:text-gray-200">
                    Your data is safe with our state-of-the-art encryption and
                    security measures, ensuring reliability and protection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="additional-features"
            className="py-12 bg-gray-50 text-center text-gray-800 dark:bg-gray-800 dark:text-gray-200 scroll-mt-24"
          >
            <h2 className="text-4xl font-extrabold mb-8 tracking-wide text-gray-800 dark:text-gray-100">
              Key Features
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-12">
              Discover the comprehensive features designed to streamline data
              management and reporting, offering powerful insights and seamless
              control.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featureData.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700 p-8 hover:shadow-xl transition duration-500 transform hover:scale-105"
                >
                  <div
                    className={`w-16 h-16 ${feature.iconColor} ${feature.iconTextColor} rounded-full flex items-center justify-center text-3xl mb-6 mx-auto`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:${feature.hoverTextColor}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-4 group-hover:text-white-700">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="py-16 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-center text-gray-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 dark:text-gray-200"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-wide">
                Get in Touch
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10">
                Have any questions or need more information? We&apos;re here to help!
                Reach out to us and we&apos;ll get back to you as soon as possible.
              </p>

              <div className="flex justify-center items-center space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600 animate-bounce dark:text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7-7 7M5 12h14"
                  />
                </svg>
                <a
                  href="#"
                  className="inline-block bg-blue-600 text-white py-4 px-10 rounded-full text-xl font-semibold shadow-lg transform transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
                  onClick={handleContactClick}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-gray-300">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Company Information */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-2 text-white dark:text-gray-100">
                    AnRepo
                  </h3>
                  <p className="text-gray-400 text-sm dark:text-gray-500">
                    A platform designed to streamline your data management and
                    reporting.
                  </p>
                </div>

                {/* Footer Links */}
                <div className="flex justify-center space-x-6">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 dark:text-white dark:hover:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 dark:text-white dark:hover:text-blue-400"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 dark:text-white dark:hover:text-blue-400"
                  >
                    Support
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  &copy; 2024 AnRepo. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}

export default Landing