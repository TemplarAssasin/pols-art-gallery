'use client' 
import { useState } from "react";
import { PopCardInfo } from "../types/variable-types";
import { updateRecord, uploadImageAndGetUrl } from "../utils/crud-function";
import toast from 'react-hot-toast'
import PopCard from "./PopCard";

type EditTypes = {
    field: string,
    id: number | any,
    onClose: () => void
}
export default function EditField({field, id, onClose,} : EditTypes){
    
    const [fileName, setFileName] = useState("Upload New Image");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [update, setUpdate] = useState<PopCardInfo>({
        title: "",
        date: "",
        description: "",
        image_url: ""
    });


    const selectedField = () => { // HANDLES THE ASSIGNING OF VALUE TO EDIT BASE ON USER SELECTION
        switch(field.toLowerCase()) {
                case "title": 
                    return (
                    <div>
                        <input 
                            type="text" 
                            onChange={(e) => setUpdate({...update, title: e.target.value})}
                            placeholder="Enter new title"
                            className="max-sm:text-xs sm:text-base md:text-lg lg:text-xl font-light px-2 py-1 w-full border  rounded"/>
                    </div>
                    )
                case "date": 
                    return (
                    <div>
                        <input type="date" name="" id="" 
                            className="max-sm:text-xs sm:text-base md:text-lg lg:text-xl border w-full px-2 py-1 rounded font-light "
                        onChange={(e) => {setUpdate({...update, date:e.target.value})}}/>
                    </div>
                );
                case "description": 
                    return (
                    <div>
                        <textarea name="" id="" rows={5} maxLength={700}
                            className="max-sm:text-[9px] sm:text-[10px] md:text-sm lg:text-base font-medium resize-none w-full border rounded p-2"

                            placeholder="Enter New Description Here..." onChange={(e) => setUpdate({...update, description: e.target.value})}></textarea>
                    </div>);
                case "image": 
                    return (
                    <div className="w-full  flex justify-center mx-auto">
                        <input type="file" accept="image/*" id="updateFile" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedFile(file);
                            setFileName(file.name);
                            }
                        }}  />
                        <label htmlFor="updateFile" title={fileName} className="max-sm:text-[10px] sm:text-[10px] md:text-sm lg:text-base overflow-x-hidden cursor-pointer text-center font-light border py-1 px-1.5 rounded w-[80%]">{fileName}</label>
                    </div>
                    );
                default:
                    return null;
        }
    }

    const handleEdit = async (id: number) => { // RESPONSIBLE FOR THE ACTUAL UPDATING OF RECORD TO DATABASE
        let updatedFields = {...update};
        
        const result = await updateRecord(id, updatedFields,selectedFile);

        if (!result.success) {
            console.error(`Failed to update. Error${result.error}`)
        } else {
            toast.success("Successfully Updated.");
            setSelectedFile(null);
            setFileName("Upload New Image");
            
        }
        onClose();
        <PopCard/>
    }

     return (
        <div 
            className="max-sm:w-45 sm:w-45 md:w-65 lg:w-85 h-auto gap-4 flex flex-col absolute z-50 top-10 right-10 bg-white 
            shadow-[0px_0px_5px_gray] py-2 px-5 rounded ">
            <button 
                onClick={onClose} 
                className="max-sm:text-xs sm:text-xs md:text-sm lg:text-base absolute right-2 top-2 hover:scale-130 text-shadow-2xs transition-all 
                            ease-in-out duration-300 cursor-pointer">❌
            </button>
            <p 
                className="max-sm:text-sm sm:text-base md:text-lg lg:text-xl font-bold  uppercase w-full ">Edit {field}
            </p>

            {selectedField()}

            <button 
                onClick={() => handleEdit(id)} 
                className="max-sm:text-xs max-sm:mx-8 sm:text-sm sm:mx-10 md:mx-15 md:text-base lg:text-lg cursor-pointer font-semibold  lg:mx-22 px-3 py-1 bg-blue-800
                 text-white rounded hover:bg-blue-950 hover:font-bold transition-all ease-in-out 
                    duration-300">Save
            </button>
            
        </div>
    );
}