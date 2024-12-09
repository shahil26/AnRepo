import { useState, useEffect, useCallback,useRef } from "react";
import { Button } from "@material-tailwind/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import VisModal from "../dataComponents/VisModal";
import visualizationService from "../../../services/visualizationService";

const VisualizationPreview = ({ data }) => {
    const containerRef = useRef(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (containerRef.current && data.html_template) {
        try {
          // Render the HTML excluding <script> tags
          containerRef.current.innerHTML = data.html_template.replace(/<script[\s\S]*?<\/script>/g, "");
  
          const externalScripts = [...data.html_template.matchAll(/<script src="(.*?)"><\/script>/g)]
            .map(match => match[1]);
  
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
              inlineScriptContent = inlineScriptContent.replace(
                /JSON\.parse\(([\s\S]*?)\)/g,
                (match, group) => `(${group})`
              );
              new Function(inlineScriptContent)();
            }
          };
  
          loadScripts(externalScripts)
            .then(executeInlineScripts)
            .catch((err) => {
              console.error("Error loading scripts:", err);
              setError(err.message);
            });
        } catch (err) {
          console.error("Error rendering template:", err);
          setError(err.message);
        }
      }
    }, [data.html_template]);
  
    const onDragStart = (e) => {
      e.dataTransfer.setData("visualization_id", data.visualization_id);
    };
  
    return (
      <div
        draggable
        onDragStart={onDragStart}
        className="p-4 border rounded-lg mb-4 cursor-move hover:shadow-lg transition-shadow"
      >
        {error ? (
          <div className="text-red-500">Error rendering visualization</div>
        ) : (
          <div 
            className="h-40 overflow-hidden" 
            ref={containerRef}
            style={{ minHeight: '160px' }}
          />
        )}
      </div>
    );
  };
function ReportCardInside() {
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const [value, setValue] = useState();
  const [sidebarImages, setSidebarImages] = useState([]);
  const [sidebarVisualizations, setSidebarVisualizations] = useState([]);
  const [gridImages, setGridImages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVis, setSelectedVis] = useState(null);

  const fetchVisualizations = useCallback(async () => {
    try {
      const result = await visualizationService.get_visualizations();
      const filteredVisualizations = result.visualizations.filter(
        (data) => !data.is_deleted
      );
      setSidebarVisualizations(filteredVisualizations);
    } catch (error) {
      console.error("Error fetching visualizations:", error);
    }
  }, []);

  useEffect(() => {
    fetchVisualizations();
  }, [fetchVisualizations]);

  const handleGridSizeChange = (rows, cols) => {
    setGridDimensions({ rows, cols });
  };
  const handleSelect = (vis) => {
    setSelectedVis(vis);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedVis(null);
  };

  const handleDeleteSuccess = (deletedId) => {
    setSidebarVisualizations((prev) =>
      prev.filter((vis) => vis.id !== deletedId)
    );
    setIsModalOpen(false);
  };

  const onDragStart = (e, imageId) => {
    e.dataTransfer.setData("imageId", imageId);
  };

  const onDrop = (e, cellId) => {
    const imageId = e.dataTransfer.getData("imageId");
    const draggedImage = sidebarImages.find(
      (img) => img.id === parseInt(imageId)
    );

    if (draggedImage) {
      // Remove image from sidebar
      setSidebarImages(
        sidebarImages.filter((img) => img.id !== parseInt(imageId))
      );

      // Add image to grid cell
      setGridImages({ ...gridImages, [cellId]: draggedImage });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const renderGridCells = (value) => {
    const cells = [];
    let bgClass = "";

    if (value === "2x4") bgClass = "h-[200px] w-[300px]";
    else if (value === "3x1") bgClass = "h-[200px] w-[70vw]";
    else if (value === "3x3") bgClass = "h-[200px] w-[400px]";
    else if (value === "3x2") bgClass = "h-[200px] w-[600px]";

    for (let i = 0; i < gridDimensions.rows; i++) {
      for (let j = 0; j < gridDimensions.cols; j++) {
        const cellId = `${i}-${j}`;
        cells.push(
          <div
            key={cellId}
            className={`relative border border-gray-300 rounded-lg m-1 flex justify-center items-center ${bgClass}`}
            onDrop={(e) => onDrop(e, cellId)}
            onDragOver={onDragOver}
          >
            {/* Cross icon for removing image */}
            {gridImages[cellId] && (
              <div
                className="h-full w-full"
                dangerouslySetInnerHTML={{
                  __html: gridImages[cellId].html_template.replace(
                    /<script[\s\S]*?<\/script>/g,
                    ""
                  ),
                }}
              />
            )}

            {/* Grid cell content */}
            {gridImages[cellId] ? (
              <img
                src={gridImages[cellId].src}
                alt={`grid-${cellId}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center">
                <IoIosAddCircleOutline className="text-4xl text-center text-red-300" />
                <div className="text-center">Add Image</div>
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-1/4 border-r border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Visualizations
          </h2>
          <div className="overflow-y-auto mt-4 flex-1 h-[calc(100vh-200px)]">
            {sidebarVisualizations.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <h3 className="text-2xl laptop:text-4xl">
                  No visualizations found
                </h3>
              </div>
            ) : (
              sidebarVisualizations.map((vis) => (
                <VisualizationPreview key={vis.visualization_id} data={vis} />
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <div className="flex mt-6 justify-around pb-4">
            <div className="flex gap-8 justify-end">
              <Button
                color="blue"
                className="shadow-lg shadow-blue-300"
                onClick={() => {
                  handleGridSizeChange(2, 4);
                  setValue("2x4");
                }}
              >
                2 x 4
              </Button>
              <Button
                color="red"
                className="shadow-lg shadow-red-300"
                onClick={() => {
                  handleGridSizeChange(3, 1);
                  setValue("3x1");
                }}
              >
                3 x 1
              </Button>
              <Button
                color="green"
                className="shadow-lg shadow-green-300"
                onClick={() => {
                  handleGridSizeChange(3, 3);
                  setValue("3x3");
                }}
              >
                3 x 3
              </Button>
              <Button
                color="amber"
                className="shadow-lg shadow-yellow-300"
                onClick={() => {
                  handleGridSizeChange(3, 2);
                  setValue("3x2");
                }}
              >
                3 x 2
              </Button>
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="flex justify-center mt-6">
            {gridDimensions.rows > 0 && gridDimensions.cols > 0 && (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
                }}
              >
                {renderGridCells(value)}
              </div>
            )}
          </div>
        </div>
        {isModalOpen && selectedVis && (
          <VisModal
            data={selectedVis}
            onClose={handleClose}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </div>
    </>
  );
}

export default ReportCardInside;
