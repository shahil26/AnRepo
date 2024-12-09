/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import visualizationService from '../../../services/visualizationService';

const VisModal = ({ data, onClose, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const dateCreated = data.date_uploaded.split("-").reverse().join("/");
    const role = data.roles[0] + (data.roles.length > 1 ? ` +${data.roles.length - 1}` : '');

    const handleDelete = async () => {
        try {
            const response = await visualizationService.delete_visualization(data.visualization_id);
            alert(response.message);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting visualization:", error);
        }
    };
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && data.html_template) {
            // Render the HTML excluding <script> tags
            containerRef.current.innerHTML = data.html_template.replace(/<script[\s\S]*?<\/script>/g, "");
    
            const externalScripts = [...data.html_template.matchAll(/<script src="(.*?)"><\/script>/g)].map(match => match[1]);
    
            const loadScripts = (scripts) => {
                return Promise.all(
                    scripts.map(src => {
                        return new Promise((resolve, reject) => {
                            const script = document.createElement("script");
                            script.src = src;
                            script.async = true;
                            script.onload = resolve;
                            script.onerror = reject;
                            document.body.appendChild(script);
                        });
                    })
                );
            };
    
            const executeInlineScripts = () => {
                const inlineScriptMatches = data.html_template.match(/<script>([\s\S]*?)<\/script>/);
                if (inlineScriptMatches && inlineScriptMatches[1]) {
                    let inlineScriptContent = inlineScriptMatches[1];
                    
                    // Patch the invalid JSON.parse({...}) call dynamically
                    inlineScriptContent = inlineScriptContent.replace(
                        /JSON\.parse\(([\s\S]*?)\)/g, 
                        (match, group) => `(${group})`
                    );
    
                    // Dynamically execute the patched inline script
                    new Function(inlineScriptContent)();
                }
            };
    
            // Load external scripts and then run the inline script
            loadScripts(externalScripts).then(executeInlineScripts).catch((error) => {
                console.error("Error loading external scripts:", error);
            });
        }
    }, [data]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-2/3 max-w-4xl relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-4 border-b pb-2 flex flex-col items-center">
                    <h2 className="text-xl font-bold">{data.title}</h2>
                </div>

                <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">Visualization Preview:</h4>
                    <div className="bg-gray-100 p-4 rounded-md overflow-y-auto h-96">
                        {/* This div will contain the HTML template */}
                        <div ref={containerRef}></div>
                    </div>
                </div>


                <div className="flex justify-between mb-4">
                    <span className="text-sm">Date Created: {dateCreated}</span>
                    <span className="text-sm">Creator Role(s): {role}</span>
                </div>

                <div className="mb-2">
                    <p className="mb-4"><strong>Description:</strong> {data.description}</p>
                    <hr />
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={() => {
                        // Edit visualization logic here
                        navigate("/dashboard/visualization");
                    }}>
                        Edit Visualization
                    </button>
                    {confirmDelete ? (
                        <div className="flex flex-col">
                            <div className="font-semibold">Are you sure?</div>
                            <div className="flex gap-2 justify-around">
                                <button className="bg-red-500 text-white py-2 px-2 rounded hover:bg-red-600" onClick={handleDelete}>
                                    Yes
                                </button>
                                <button className="bg-gray-500 text-white py-2 px-2 rounded hover:bg-gray-600" onClick={() => setConfirmDelete(false)}>
                                    No
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={() => setConfirmDelete(true)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisModal;