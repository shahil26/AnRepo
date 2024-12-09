/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogHeader, DialogBody} from "@material-tailwind/react";
import { useSelector,useDispatch } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import dataService from "../../../services/dataService";
import DataCard from "./DataCard";
import DataModal from "./DataModal";
import { VIS_UPDATE_SUCCESS } from "../../../redux/actions/types";

function SelectDataModal({ open, onClose }) {
    const [data, setData] = useState([]);
    const [dataLength, setDataLength] = useState(0);
    const initialData = useSelector((state) => state.data.vis_data);
    const [selectedData, setSelectedData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const fetchData = useCallback(async () => {
      try {
        const result = await dataService.get_data() // Fetch data using the service
        //for each data if is_deleted is true then dont show that data
        result.files_meta_data = result.files_meta_data.filter((data) => !data.is_deleted).filter((data) => !initialData.some((item) => item.file_id === data.file_id));
        setData(result.files_meta_data); // Set the fetched data
        setDataLength(result.files_meta_data.length); // Update the length of data
      } catch (error) {
        console.error("Error fetching data:", error); // Handle error
      }
    }, [initialData]);
  
    useEffect(() => {
      fetchData(); // Fetch data when the component mounts
    }, [fetchData]);


    const handleSelect = (dataItem) => {
      setSelectedData(dataItem); // Set the selected data
      setIsModalOpen(true); // Open the modal
    };
    
    const handleAdd = (data) => {
      dispatch({ type: VIS_UPDATE_SUCCESS, payload: data });
    };

    // Handle closing the modal
    const handleClose = () => {
      setIsModalOpen(false); // Close the modal
      setSelectedData(null); // Reset the selected data
    };
    return (
        <Dialog
            className="text-black"
            open={open} // Control the dialog's open state
            handler={onClose} // Close the dialog when requested
            size="md"
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
        >
            <DialogHeader>Select Data ({dataLength})</DialogHeader>
            <DialogBody className="h-96 overflow-auto">
            {data.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <h3 className="text-2xl laptop:text-4xl">No data found</h3>
            </div>
          ) : (
            data.map((dataItem, index) => (
              <div key={index} className="flex gap-2 rounded p-2 mb-1 justify-end border-solid border-2 shadow-md transition-all">
                <div className="w-11/12 ">
                <DataCard
                  key={index}
                  data={{
                    ...dataItem,
                    date_uploaded: dataItem.date_uploaded.split("T")[0], // Only display YYYY-MM-DD
                  }}
                  onSelect={handleSelect}
                />
                </div>
                <div className="w-1/12 flex items-center justify-center">
                  <IoMdAdd className="h-full w-full cursor-pointer hover:scale-75 transition-all" onClick={()=>handleAdd(dataItem)}/>
                </div>
              </div>
            ))
          )}
            </DialogBody>
            {isModalOpen && selectedData && (
            <DataModal data={selectedData} onClose={handleClose} /> // Show modal with selected data
            )}
        </Dialog>
    );
}

export default SelectDataModal;
