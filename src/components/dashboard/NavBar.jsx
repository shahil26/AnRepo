import { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { Typography, Avatar } from "@material-tailwind/react";
import { AiOutlineMenu} from "react-icons/ai";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function NavBar() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [heading, setHeading] = useState("Overview");
  const userImage = useSelector((state) => state.user.image);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const changeHeader = (heading) => {
    setHeading(heading);
  }

  const [dark, setDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const darkModeHandler = () => {
    const newDarkMode = !dark;
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);
    setDark(newDarkMode);
  };

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle("dark", isDarkMode);
  }, []);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const headersnames = {
      'overview': 'Overview',
      'panel': 'Control Panel',
      'chat': 'Assistant',
      'contact': 'Contact Us',
      'documentation': 'Documentation',
      'upload': 'Data Upload',
      'visualization': 'Data Visualization',
      'report': 'Annual Report',
      'reportcard': 'Report Card',
      'settings': 'Settings'
    };
    const headerText = headersnames[path] || 'Overview';
    changeHeader(headerText);
  }, [location.pathname]);

  return (
    <>
    <div className="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-2 sm:gap-4 sm:p-4 md:gap-6 h-20 z-20 shadow-sm bg-white dark:bg-black dark:border-b dark:border-white">
      {/* Brand Logo and Name */}
      <div className="flex items-center gap-4 ml-4 ">
        <button
            className="dark:text-white rounded-full w-fit hover:bg-gray-100 p-2 dark:hover:bg-gray-800"
            onClick={toggleSidebar}
        >
        <AiOutlineMenu className="h-6 w-6" />
        </button>
        <img
          src="/logo.png"
          alt="brand"
          className="h-10 w-10"
        />
      </div>

      {/* NavBar Title */}
      <Typography
        variant="h4"
        className="font-bold text-xl sm:text-2xl md:text-3xl flex-grow text-center pr-4 dark:text-white hidden sm:block"
      >
        {heading}
      </Typography>

      {/* Avatar and User Info */}
      <div className="flex items-center mr-4 md:mr-8 gap-5">
      <div id="google_translate_element"></div>
      <button onClick={()=> darkModeHandler()} className={`p-2 rounded-full w-fit ${dark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 hover:text-yellow-300' : 'bg-gray-300 text-blue-900 hover:bg-gray-400'}`}>
          {
              
              dark && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
          }
          {
              !dark && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
          }
        </button>
        <Link to="settings" onClick = {() => changeHeader("Settings")}>
        <Avatar
          src={userImage ? `http://64.227.158.253/uploads/images/${encodeURIComponent(userImage)}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
          alt="avatar"
          className="h-10 w-10"
        />
        </Link>

      </div>
    </div>
    <div className="h-20"></div>
    <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <Outlet />
  </>

  );
}

export default NavBar;
