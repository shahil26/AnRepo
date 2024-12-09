/* eslint-disable react/prop-types */
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileExcel, FaFileCsv, FaImage, FaFile } from 'react-icons/fa';

const DataCard = ({ data, onSelect }) => {
    const date = data.date_uploaded.split("-").reverse().join("/");
    const priority_roles = ["Admin", "Head", "Financial Officer", "Faculty", "Reviewer", "Viewer", "Student"];
    let role;
    for (let i = 0; i < priority_roles.length; i++) {
        if (data.uploader_roles.includes(priority_roles[i])) {
            role = priority_roles[i];
            break;
        }
    }
    if(data.uploader_roles.length>1){
        role+=" +"+(data.uploader_roles.length-1);
    }
    // Map content types to icons
    const getIcon = (contentType) => {
        switch (contentType) {
            case "application/pdf":
                return <FaFilePdf className="text-red-600" />;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // DOCX
            case "application/msword": // DOC
                return <FaFileWord className="text-blue-600" />;
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation": // PPTX
            case "application/vnd.ms-powerpoint": // PPT
                return <FaFilePowerpoint className="text-orange-600" />;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // XLSX
            case "application/vnd.ms-excel": // XLS
                return <FaFileExcel className="text-green-600" />;
            case "text/csv":
                return <FaFileCsv className="text-green-800" />;
            case "image/jpeg":
            case "image/jpg":
            case "image/png":
            case "image/gif":
            case "image/svg+xml":
            case "image/webp":
                return <FaImage className="text-purple-600" />;
            default:
                return <FaFile className="text-gray-500" />; // Default icon for unknown types
        }
    };

    return (
        <div className="flex justify-between items-center bg-white p-2 rounded shadow hover:shadow-lg hover:scale-95 transition-all cursor-pointer border mx-2 my-1" onClick={() => onSelect(data)}>
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg text-5xl">
                {getIcon(data.content_type)}
            </div>
            <div className="flex flex-col ml-4 text-right">
                <h3 className="font-bold text-lg">{data.file_name}</h3>
                <p className="text-gray-600">{date}</p>
                <p className="text-gray-600">{role}</p>
            </div>
        </div>
    );
};


export default DataCard;