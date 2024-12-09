/* eslint-disable react/prop-types */
import { FaChartBar, FaChartPie, FaChartLine, FaChartArea} from "react-icons/fa";
import { LuScatterChart } from "react-icons/lu";
import { RiDonutChartFill,RiOrganizationChart } from "react-icons/ri"; 
import { PiChartPolar } from "react-icons/pi";
import { AiOutlineRadarChart } from "react-icons/ai";
import { CiViewTimeline, CiViewTable } from "react-icons/ci";

const VisCard = ({ data, onSelect }) => {
    const date = data.date_uploaded.split("-").reverse().join("/");
    const priority_roles = ["Admin", "Head", "Financial Officer", "Faculty", "Reviewer", "Viewer", "Student"];
    let role = priority_roles.find(r => data.roles.includes(r)) || data.roles[0];
    
    if(data.roles.length > 1){
        role += " +" + (data.roles.length - 1);
    }

    const getIcon = (visualizationType) => {
        switch (visualizationType) {
            case "bar_chart":
                return <FaChartBar className="text-blue-600" />;
            case "pie_hart":
                return <FaChartPie className="text-green-600" />;
            case "line_chart":
                return <FaChartLine className="text-red-600" />;
            case "area_chart":
                return <FaChartArea className="text-purple-600" />;
            case "bubble_chart":
                return <FaChartBar className="text-yellow-600" />;
            case "donut_chart":
                return <RiDonutChartFill className="text-blue-600" />;
            case "scatter_chart":
                return <LuScatterChart className="text-green-600" />;
            case "polar_area_chart":
                return <PiChartPolar className="text-red-600" />;
            case "radar_chart":
                return <AiOutlineRadarChart className="text-purple-600" />;
            case "timeline_chart":
                return <CiViewTimeline className="text-yellow-600" />;
            case "organization_chart":
                return <RiOrganizationChart className="text-blue-600" />;
            case "table":
                return <CiViewTable className="text-green-600" />;
            default:
                return <FaChartBar className="text-gray-600" />;
        }
    };

    return (
        <div className="flex justify-between items-center bg-white p-2 rounded shadow hover:shadow-lg hover:scale-95 transition-all cursor-pointer border mx-2 my-1" onClick={() => onSelect(data)}>
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg text-5xl">
                {getIcon(data.viz_type)}
            </div>
            <div className="flex flex-col ml-4 text-right">
                <h3 className="font-bold text-lg">{data.title}</h3>
                <p className="text-gray-600">{date}</p>
                <p className="text-gray-600">{role}</p>
            </div>
        </div>
    );
};

export default VisCard;