import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import VisCard from './dataComponents/VisCard';
import VisModal from './dataComponents/VisModal';
import VisUpload from './dataComponents/VisUpload';
import visualizationService from '../../services/visualizationService';
import { VIS_UPDATE_SUCCESS } from "../../redux/actions/types";

const Visualization = () => {
    const dispatch = useDispatch();
    const selectedData = useSelector((state) => state.data.vis_data);
    const [visualizations, setVisualizations] = useState([]);
    const [visualizationLength, setVisualizationLength] = useState(0);
    const [selectedVis, setSelectedVis] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterRole, setFilterRole] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [visTypeFilter, setVisTypeFilter] = useState("");
    const [sortOption, setSortOption] = useState("date_uploaded_desc");
    const [customQuery, setCustomQuery] = useState("");

    const fetchVisualizations = useCallback(async () => {
        try {
            const result = await visualizationService.get_visualizations();
            result.visualizations = result.visualizations.filter((data) => !data.is_deleted);
            setVisualizations(result.visualizations);
            setVisualizationLength(result.visualizations.length);
        } catch (error) {
            console.error("Error fetching visualizations:", error);
        }
    }, []);

    useEffect(() => {
        fetchVisualizations();
    }, [fetchVisualizations]);

    const handleUploadSuccess = () => {
        fetchVisualizations();
    };

    const handleDeleteSuccess = () => {
        fetchVisualizations();
    };

    const handleSelect = (visItem) => {
        setSelectedVis(visItem);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedVis(null);
    };

    const priority_roles = useMemo(() => ["Admin", "Head", "Financial Officer", "Faculty", "Reviewer", "Viewer", "Student"], []);

    const filteredVisualizations = useMemo(() => {
        let filtered = [...visualizations];

        if (filterRole) {
            filtered = filtered.filter((v) => v.roles.includes(filterRole));
        }
        if (visTypeFilter) {
            filtered = filtered.filter((v) => v.viz_type === visTypeFilter);
        }
        
        const today = new Date();
        if (dateFilter === "today") {
            filtered = filtered.filter((v) => {
                const date = new Date(v.date_uploaded.split("T")[0]);
                return date.toDateString() === today.toDateString();
            });
        } else if (dateFilter === "this_week") {
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7); // Set to 7 days before today

            filtered = filtered.filter((v) => {
                const date = new Date(v.date_uploaded.split("T")[0]);
                return date >= sevenDaysAgo && date <= today;
            });
        } else if (dateFilter === "this_month") {
            filtered = filtered.filter((v) => {
                const date = new Date(v.date_uploaded.split("T")[0]);
                return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
            });
        } else if (dateFilter === "this_year") {
            filtered = filtered.filter((v) => {
                const date = new Date(v.date_uploaded.split("T")[0]);
                return date.getFullYear() === today.getFullYear();
            });
        }

        filtered.sort((a, b) => {
            const priorityA = priority_roles.indexOf(a.roles[0]) !== -1 ? 
                              priority_roles.indexOf(a.roles[0]) : priority_roles.length;
            const priorityB = priority_roles.indexOf(b.roles[0]) !== -1 ? 
                              priority_roles.indexOf(b.roles[0]) : priority_roles.length;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            const dateA = new Date(a.date_uploaded);
            const dateB = new Date(b.date_uploaded);

            if (sortOption === "date_uploaded_asc") {
                return dateA - dateB;
            } else if (sortOption === "date_uploaded_desc") {
                return dateB - dateA;
            }

            return 0;
        });
        
        return filtered;
    }, [filterRole, dateFilter, visTypeFilter, sortOption, visualizations, priority_roles]);

    const handleRemoveSelectedData = (index) => {
        const updatedSelectedData = [...selectedData];
        updatedSelectedData.splice(index, 1);
        dispatch({ type: VIS_UPDATE_SUCCESS, payload: updatedSelectedData });
    };

    const handleCreateVisualization = () => {
        // Logic to create visualization based on selected data and custom query
        console.log("Creating visualization with:", selectedData, customQuery);
    };

    return (
        <div className="mx-auto mt-4 lg:mt-8">
            <div className="p-4 flex laptop:flex-row flex-col laptop:gap-8">
                <div className="w-full lg:w-1/2">
                    <VisUpload onUploadSuccess={handleUploadSuccess} />
                </div>

                <div className="w-full mb-8 shadow-xl h-fit min-h-[80vh] lg:w-1/2 rounded-lg bg-gray-100 p-5">
                    <h2 className="text-xl font-bold mb-4 text-center">Visualizations ({filteredVisualizations.length})</h2>
                    
                    <div className="flex gap-4 mb-6 justify-center">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="p-2 border rounded w-1/4"
                        >
                            <option value="">All Roles</option>
                            {priority_roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={visTypeFilter}
                            onChange={(e) => setVisTypeFilter(e.target.value)}
                            className="p-2 border rounded w-1/4"
                        >
                            <option value="">All Types</option>
                            <option value="bar_chart">Bar Chart</option>
                            <option value="pie_chart">Pie Chart</option>
                            <option value="line_chart">Line Chart</option>
                            <option value="area_chart">Area Chart</option>
                            <option value="bubble_chart">Bubble Chart</option>
                            <option value="donut_chart">Donut Chart</option>
                            <option value="scatter_chart">Scatter Chart</option>
                            <option value="polar_area_chart">Polar Area Chart</option>
                            <option value="radar_chart">Radar Chart</option>
                            <option value="timeline_chart">Timeline Chart</option>
                            <option value="organization_chart">Organization Chart</option>
                            <option value="table">Table</option>
                        </select>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="p-2 border rounded w-1/4"
                        >
                            <option value="">All Dates</option>
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="this_year">This Year</option>
                        </select>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="p-2 border rounded w-1/4"
                        >
                            <option value="date_uploaded_desc">Latest</option>
                            <option value="date_uploaded_asc">Oldest</option>
                            <option value="priority">By Priority</option>
                        </select>
                    </div>

                    <div className="overflow-y-auto mt-4 flex-1 h-[60vh]">
                        {filteredVisualizations.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <h3 className="text-2xl laptop:text-4xl">No visualizations found</h3>
                            </div>
                        ) : (
                            filteredVisualizations.map((visItem,index) => (
                                <VisCard
                                    key={index}
                                    data={{...visItem,
                                        date_uploaded: visItem.date_uploaded.split("T")[0],
                                    }}
                                    onSelect={handleSelect}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && selectedVis && (
                <VisModal data={selectedVis} onClose={handleClose} onDeleteSuccess={handleDeleteSuccess} />
            )}
        </div>
    );
};

export default Visualization;