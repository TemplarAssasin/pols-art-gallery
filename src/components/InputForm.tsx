'use client'
import { useState, useRef} from 'react'
import { handleChange, handleSubmit } from '@/src/utils/crud-function';
import { useClickOutside } from '../utils/helper';

export default function Form() {
    const [form, setForm] = useState({
      title: "",
      date: "",
      description: "",
      file: null as File | null,
      fileName: "Upload File", 
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<boolean | any>(true)
    const popCardRef = useRef<HTMLDivElement>(null);
    useClickOutside(popCardRef, () => {
        setState(!state);
    })

  if (!state) return null;
  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div ref={popCardRef} className="w-[30%] h-fit flex flex-col gap-10 fixed z-99">
      <form 
        onSubmit={(e) => {handleSubmit(e, form, setForm, fileInputRef,setState)}} 
        className=" px-0 py-8 bg-white shadow-2xl rounded-md flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold mb-2 text-shadow-2xs">ADD ARTWORK</h1>
            <div className="w-[80%] flex flex-col gap-1">
                  <label htmlFor="title" className="text-base">Artwork Name: </label>
                  <input 
                    type="text" 
                    id="title" 
                    maxLength={20} 
                    value= {form.title} 
                    placeholder="Enter artwork name" 
                    onChange={(e) => handleChange(e, setForm)} 
                    className="border-1 rounded-xs pl-1"/>
                  <label htmlFor="description">Description:</label>
                  <textarea 
                    id="description" 
                    value={form.description}
                    maxLength={700} 
                    onChange={(e) => handleChange(e, setForm)} 
                    className="resize-none border-1 rounded px-1" 
                    rows={5} 
                    placeholder='Enter artwork description here...'/>
                  <label htmlFor="date" className="text-base">Date Created: </label>
                  <input 
                    type="date" 
                    id="date"  
                    value= {form.date} 
                    onChange={(e) => handleChange(e, setForm)} 
                    className="border-1 rounded-xs pl-1 w-fill "/>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    id="file" 
                    onChange={(e) => handleChange(e, setForm)} 
                    accept="image/*" 
                    className="hidden"/>
                <label 
                  htmlFor="file" 
                  className={`self-center text-center shadow-[2px_2px_5px_gray] rounded-md py-1.5 px-3 w-fit cursor-pointer my-5`}>
                    {form.fileName}
                </label>
                <button 
                  type="submit" 
                  className="bg-gray-800 font-bold text-white rounded-md px-7 py-2 hover:bg-gray-500 cursor-pointer"
                  >Add
                </button>
            </div>
      </form>
    </div>
    </div>
  )

}
