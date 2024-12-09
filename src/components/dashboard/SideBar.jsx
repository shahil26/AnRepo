/* eslint-disable react/prop-types */
import React from "react";
import {Card,Typography,List,ListItem,ListItemPrefix,Accordion,AccordionHeader,AccordionBody} from "@material-tailwind/react";
import {BellIcon, Cog6ToothIcon,PowerIcon} from "@heroicons/react/24/solid";
import {ChevronRightIcon,ChevronDownIcon, DocumentChartBarIcon, PresentationChartBarIcon, ClipboardDocumentListIcon} from "@heroicons/react/24/outline";
import { AiOutlineControl, AiOutlineMenu} from "react-icons/ai";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { LOGOUT } from "../../redux/actions/types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function SideBar({ isOpen,toggleSidebar}) {
    const roles = useSelector(state => state.user.roles);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sidebarRef = React.useRef(null);
    const logout = () => {
        authService.logout();
        dispatch({ type: LOGOUT });
        navigate('/login');
    };
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          toggleSidebar();
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, toggleSidebar]);
    const [open, setOpen] = React.useState(-1); ;
    const handleOpen = (value) => {
      setOpen(open === value ? -1 : value);
    };
  return (
    <div ref={sidebarRef} className={`fixed top-0 left-0 z-50 bg-white h-screen w-[18rem] transition-transform duration-300 overflow-auto max-w-full ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
  <Card className="dark:bg-blue-100 w-full max-w-[18rem] h-fit p-4 shadow-xl border-r rounded-none overflow-auto min-h-screen">
      <div className="flex justify-between">
        <button className="ml-2 p-2 rounded-full w-fit text-black hover:bg-gray-100" onClick={toggleSidebar}>
          <AiOutlineMenu className="h-6 w-6" />
        </button>
        <img src="/logo.png" alt="brand" className="h-10 w-10" />
      </div>
      <List>
        <Link to="overview"><ListItem><ListItemPrefix><PresentationChartBarIcon className="h-5 w-5" /></ListItemPrefix>Overview</ListItem></Link>

        {(roles.includes("Admin") || roles.includes("Head") || roles.includes("Financial Officer") || roles.includes("Faculty") || roles.includes("Student")) && <Accordion open={open === 0} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 0 ? "rotate-180" : ""}`} />}>
          <ListItem className="p-0" selected={open === 0}>
            <AccordionHeader onClick={() => handleOpen(0)} className="border-b-0 p-3">
              <ListItemPrefix><ClipboardDocumentListIcon className="h-5 w-5" /></ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">Reports</Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="report"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Annual Report</ListItem></Link>
              <Link to="reportcard"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Report Card</ListItem></Link>
            </List>
          </AccordionBody>
        </Accordion>}

        {(roles.includes("Admin") || roles.includes("Head") || roles.includes("Financial Officer") || roles.includes("Faculty") || roles.includes("Student")) && <Accordion open={open === 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />}>
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix><DocumentChartBarIcon className="h-5 w-5" /></ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">Data</Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="upload"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Upload Data</ListItem></Link>
              <Link to="visualization"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Create Visualization</ListItem></Link>
            </List>
          </AccordionBody>
        </Accordion>}


        <Accordion open={open === 2} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`} />}>
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
              <ListItemPrefix>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">Help</Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="documentation"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Documentation</ListItem></Link>  
              <Link to="chat"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Chat with Assistant</ListItem></Link>
              <Link to="contact"><ListItem><ListItemPrefix><ChevronRightIcon strokeWidth={3} className="h-3 w-5" /></ListItemPrefix>Contact Us</ListItem></Link>
            </List>
          </AccordionBody>
        </Accordion>
        

        <hr className="my-2 border-blue-gray-50" />
        {roles.includes("Admin") && <Link to="panel"><ListItem><ListItemPrefix><AiOutlineControl className="h-5 w-5" /></ListItemPrefix>Control Panel</ListItem></Link>}
        <Link to ="notify"><ListItem><ListItemPrefix><BellIcon className="h-5 w-5" /></ListItemPrefix>Notify</ListItem></Link>
        <Link to="settings"><ListItem><ListItemPrefix><Cog6ToothIcon className="h-5 w-5" /></ListItemPrefix>Settings</ListItem></Link>
        <Link to="/login" onClick={logout}><ListItem><ListItemPrefix><PowerIcon className="h-5 w-5" /></ListItemPrefix>Log Out</ListItem></Link>
      </List>
    </Card>
  </div>
  );
}

export default SideBar;