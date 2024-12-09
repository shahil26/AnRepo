/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, Option} from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import visualizationService from '../../../services/visualizationService';
import DataCard from './DataCard';
import DataModal from './DataModal';
import SelectDataModal from './selectDataModal';
import { SET_VIS_DATA } from '../../../redux/actions/types';

const VisUpload = ({ onUploadSuccess }) => {
    const initialData = useSelector((state) => state.data.vis_data);
    const dispatch = useDispatch();
    const titleElement = useRef();
    const descriptionElement = useRef();
    const queryElement = useRef();
    const [visualizationType, setVisualizationType] = useState("bar_chart");
    const [visualizationCategory, setVisualizationCategory] = useState("Informative");
    const [selectedRoles, setSelectedRoles] = useState(["Head", "Faculty", "Student", "Financial Officer"]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [open, setOpen] = useState(false);

    const roles = ["Head", "Faculty", "Student", "Financial Officer"];

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedRoles((prevRoles) => [...prevRoles, value]);
        } else {
            setSelectedRoles((prevRoles) => prevRoles.filter((role) => role !== value));
        }
    };

    const handleOpen = () => setOpen(!open);

    const handleDelete = (data) => {
        return () => {
            const newData = initialData.filter((d) => d.file_name !== data.file_name);
            dispatch({ type: "SET_VIS_DATA", payload: newData });
        };
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!titleElement.current.value || titleElement.current.value.length > 30 || !descriptionElement.current.value || selectedRoles.length === 0) {
            if (!titleElement.current.value) {
                alert("Title is required");
            } else if (titleElement.current.value.length > 30) {
                alert("Title must be less than 30 characters");
            } else if (!descriptionElement.current.value) {
                alert("Description is required");
            } else if (selectedRoles.length === 0) {
                alert("Please select at least one role");
            }
            return;
        }

        const fileIds = initialData.map(data => data.file_id);

        const formData = new FormData();
        formData.append('title', titleElement.current.value);
        formData.append('description', descriptionElement.current.value);
        formData.append('custom_query', queryElement.current.value);
        formData.append('viz_type', visualizationType);
        formData.append('roles', selectedRoles);
        formData.append('viz_format', visualizationCategory);
        fileIds.forEach(file_id => formData.append('files', file_id));

        try {
            await visualizationService.create_visualization(formData);
            alert("Visualization created successfully");
            onUploadSuccess();
            // Clear the form fields and reset state
            titleElement.current.value = "";
            descriptionElement.current.value = "";
            queryElement.current.value = ""; 
            setVisualizationType("bar_chart");
            setVisualizationCategory("Informative");
            setSelectedRoles(["Head", "Faculty", "Student", "Financial Officer"]);

            // Clear initial data by dispatching an action to set it to an empty array
            dispatch({ type: SET_VIS_DATA, payload: [] });
        } catch (e) {
            alert("Error creating visualization", e);
        }
    };

    const handleSelect = (dataItem) => {
        setSelectedData(dataItem); // Set the selected data
        setIsModalOpen(true); // Open the modal
    };
    
      // Handle closing the modal
      const handleClose = () => {
        setOpen(false); // Close the modal
        setIsModalOpen(false); // Close the modal
        setSelectedData(null); // Reset the selected data
    };
    return (
        <div className="p-4 shadow-xl rounded-lg mb-6 mt-6 mobile:mt-0 h-fit min-h-[80vh] laptop:w-full lg:w-full bg-gray-100">
            <h2 className="text-xl font-bold mb-9 text-center">Create Visualization</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" className="w-full p-2 mb-4 border rounded" ref={titleElement} />

                {/* Description and Custom Query fields side by side */}
                <div className="flex gap-4 mb-4">
                    <textarea name="description" placeholder="Description" className="w-1/2 p-2 border rounded h-24" ref={descriptionElement}></textarea>
                    <textarea name="custom_query" placeholder="Custom Query" className="w-1/2 p-2 border rounded h-24" ref={queryElement}></textarea>
                </div>

                <div className="flex justify-between gap-4">
                    {/* Access Roles */}
                    <div className="relative w-1/3">
                        <button type="button" onClick={toggleDropdown} className="w-full p-2 border rounded transparent border-gray-400">
                            {selectedRoles.length === 0 ? "Select Data Access Roles" : `${selectedRoles.length} Access Roles Selected`}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-10 mt-2 w-full border bg-white shadow-lg rounded-md">
                                {roles.map((role) => (
                                    <label key={role} className="block p-2">
                                        <input type="checkbox" value={role} checked={selectedRoles.includes(role)} onChange={handleRoleChange} className="mr-2" />
                                        {role}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visualization Type */}
                    <div className="w-1/3">
                        <Select label="Visualization Type" value={visualizationType} onChange={(val) => setVisualizationType(val)} menuProps={{className: "max-h-40 overflow-y-auto"}}>
                            <Option value="bar_chart">Bar Chart</Option>
                            <Option value="area_chart">Area Chart</Option>
                            <Option value="bubble_chart">Bubble Chart</Option>
                            <Option value="donut_chart">Donut Chart</Option>
                            <Option value="pie_chart">Pie Chart</Option>
                            <Option value="line_chart">Line Chart</Option>
                            <Option value="scatter_chart">Scatter Chart</Option>
                            <Option value="polar_area_chart">Polar Area Chart</Option>
                            <Option value="radar_chart">Radar Chart</Option>
                            <Option value="timeline_chart">Timeline Chart</Option>
                            <Option value="organization_chart">Organization Chart</Option>
                            <Option value="table">Table</Option>
                        </Select>
                    </div>

                    {/* Data Category */}
                    <div className="w-1/3">
                        <Select label="Visualization Category" value={visualizationCategory} onChange={(val) => setVisualizationCategory(val)}>
                            <Option value="Financial">Financial</Option>
                            <Option value="Trends">Trends</Option>
                            <Option value="Descriptive">Descriptive</Option>
                            <Option value="Achievements">Achievements</Option>
                            <Option value="Facilities">Facilities</Option>
                            <Option value="Informative">Informative</Option>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-between h-fit m-2 items-center">
                <h1 className="text-center mt-4 font-bold">SELECTED DATA</h1>
                <button type="button" onClick={handleOpen} className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4">Add Data</button>
                </div>
                <SelectDataModal open={open} onClose={handleClose} />
                <div className="border-2 flex p-2 overflow-auto h-fit gap-2 flex-nowrap mb-4">
                {initialData.length === 0 && <p className="text-center">No data selected</p>}
                {initialData.map((data, index) => (
                    <div key={index}
                        className="bg-white w-fit p-2 mb-4 shrink-0 rounded  border-solid border-2 shadow-md transition-all  flex items-center">
                        <DataCard
                            key={index}
                            data={{
                            ...data,
                            date_uploaded: data.date_uploaded.split("T")[0],
                            }}
                            onSelect={handleSelect}
                        />
                        <MdDelete className="text-4xl cursor-pointer" color="red" onClick={handleDelete(data)}/>
                    </div>
                            
                    ))}
                </div>
                {/* Data Modal */}
                {isModalOpen && selectedData && (
                    <DataModal data={selectedData} onClose={handleClose} /> // Show modal with selected data
                )}
                {/* Select Data Modal */}

                <div className="flex justify-center">
                    <button type="submit" className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4">
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VisUpload;
