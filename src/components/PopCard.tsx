import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare,   } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@/src/utils/helper'
import { PopCardInfo } from '@/src/types/variable-types'
import Image from 'next/image'
import EditField from "./UpdateField";

export default function PopCard({
    id,
    description,
    title,
    date,
    image_url
    }: PopCardInfo) {    
        const [activeEditField, setActiveEditField] = useState<string | null>(null);
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLUListElement>(null);
        
        useEffect(() => { // TRACKS THE MOUSEUP AND MOUSEDOWN EVENT IN THE POP CARD CONTAINER 
            const handleClickOutside = (event:MouseEvent) => {
                if (
                    dropdownRef.current &&
                    !(dropdownRef.current as HTMLElement).contains(event.target as Node)
                ) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
            },[]);

          const handleOptionClick = (field: string) => {
            setActiveEditField(field); // SETS WHICH FIELD TO EDIT
            setIsOpen(false); // CLOSE DROPDOWN EDIT MENU
        };
    return (
        <article
            className="fixed inset-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-49 w-[70%] h-[80%] bg-white rounded shadow-2xl
            ">
            <div className="absolute right-3 top-2">               
                <FontAwesomeIcon 
                    icon={faPenToSquare} 
                    className="text-2xl  peer cursor-pointer text-gray-800 hover:text-gray-900 hover:scale-120 transition-all ease-in-out duration-300"
                    onClick={() => {setIsOpen(!isOpen)}}
                    />
                {isOpen &&(
                    
                    <ul 
                        ref={dropdownRef} 
                        className="absolute w-35 right-0 bg-gray-200 p-3 rounded [&>li]:text-sm font-normal [&>li]:text-black
                         [&>li]:hover:bg-gray-300 [&>li]:hover:text-black [&>li]:rounded-xs scale-100 transition-all duration-300 
                         ease-in-out [&>li]:cursor-pointer [&>li]:hover:font-semibold [&>li]:hover:text-base
                          [&>li]:px-1 ">
                        <li className="transition-all duration-50 ease-linear" onClick={() => handleOptionClick("Title")}>Title</li>
                        <li className="transition-all duration-50 ease-linear" onClick={() => handleOptionClick("Date")}>Date</li>
                        <li className="transition-all duration-50 ease-linear" onClick={() => handleOptionClick("Description")}>Description</li>
                        <li className="transition-all duration-50 ease-linear" onClick={() => handleOptionClick("Image")}>Image</li>
                    </ul>
                )
                }
            </div>
            {activeEditField && <EditField onClose={() => setActiveEditField(null)} id={id} field={activeEditField} />}
            
            <div className="overflow-hidden grid grid-rows-8 gap-x-4 grid-cols-4 p-4 w-full h-full">
                <div className="col-start-3 col-end-[-1] row-start-1 row-end-3 text-center self-center justify-self-center">
                    <p className="text-3xl font-bold">{title}</p>
                    <p className="text-base font-normal">{formatDate(date)}</p>
                </div>
                <div className="row-start-3 row-end-[-1] col-start-3 col-end-[-1]">
                    <p className=" font-light break-words text-base indent-8 text-justify p-4 h-full">
                    {description}
                    </p>
                </div>
                <Image
                    src={image_url}
                    alt=""
                    width={500}
                    height={500}
                    priority
                    className="w-full h-full row-start-1 row-end-[-1] col-span-2 rounded object-cover"
                />
            </div>
        </article>
    )
}
