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
            className="overflow-auto max-sm:w-[75%] max-sm:h-[50%] sm:w-[60%] sm:h-[60%] md:w-[60%] md:h-[70%] lg:w-[70%] lg:h-[80%] fixed inset-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-49  bg-white rounded shadow-2xl
            ">
            <div className="absolute right-3 top-2">               
                <FontAwesomeIcon 
                    icon={faPenToSquare} 
                    className="max-sm:text-sm sm:text-base md:text-xl lg:text-2xl  peer cursor-pointer text-gray-800 hover:text-gray-900 hover:scale-120 transition-all ease-in-out duration-300"
                    onClick={() => {setIsOpen(!isOpen)}}
                    />
                {isOpen &&(
                    
                    <ul 
                        ref={dropdownRef} 
                        className="max-sm:[&>li]:text-[9px] sm:[&>li]:text-[10px] md:[&>li]:text-xs lg:[&>li]:text-sm absolute max-sm:w-20 sm:w-25 md:w-30 lg:w-35 right-0 bg-gray-200 p-3 rounded  font-normal [&>li]:text-black
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
            
            <div className="max-sm:flex max-sm:flex-col  max-sm:h-fit overflow-auto grid grid-rows-8 gap-x-4 grid-cols-4 p-4 w-full h-full">
                <div className="col-start-3 col-end-[-1] row-start-1 row-end-3 text-center self-center justify-self-center">
                    <p className="max-sm:text-sm sm:text-base md:text-xl lg:text-4xl font-bold">{title}</p>
                    <p className="max-sm:mb-2 max-sm:text-xs sm:text-xs md:text-sm lg:text-base font-normal">{formatDate(date)}</p>
                </div>
                
                <Image
                    src={image_url}
                    alt=""
                    width={500}
                    height={500}
                    priority
                    className="max-sm:self-center max-sm:w-[250px] max-sm:h-[220px] sm:sticky top-0 w-full h-full row-start-1 row-end-[-1] col-span-2 rounded object-cover"
                />
                <div className=" row-start-3 row-end-[-1] col-start-3 col-end-[-1]">
                    <p className="max-sm:mt-5 max-sm:px-2 max-sm:text-[10px] sm:text-[10px] md:text-xs lg:text-sm font-light break-words  indent-8 text-justify px-3 h-full">
                    {description}
                    </p>
                </div>
            </div>
        </article>
    )
}
