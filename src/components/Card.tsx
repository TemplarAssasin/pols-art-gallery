'use client';
import Image from 'next/image';
import { handleDelete } from '@/src/utils/crud-function';
import { CardInfo } from '@/src/types/variable-types';
import { formatDateTwo } from '../utils/helper';
import {  faTrash  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Card({ id,title, date, image_url, onClick, showDelete=true}: CardInfo) {
  return (
    <div 
      onClick={onClick} 
      className="overflow-hidden group relative hover:scale-105 transition-all ease-in-out duration-300 
      w-full h-full rounded-md bg-white shadow-2xl p-3 flex flex-col gap-3 cursor-pointer">
      { showDelete && (
      <button onClick={(e) => {
        handleDelete(id)
        e.stopPropagation();}}
      
      className="text-white absolute z-10 right-5 top-5 text-xl rounded-[50%] p-1 scale-0 hover:scale-110
                group-hover:scale-90 transition-all ease-in-out duration-400 hover:cursor-pointer 
                hover:bg-white hover:text-black">
          <FontAwesomeIcon icon={faTrash}/>
      </button>)}

      <div className="relative w-full h-[200px]">
        <Image
          src={image_url}
          alt={`image of ${title}`}
          fill
          className="rounded-md object-cover"
          priority
        />
      </div>
      
      <div className="flex flex-col text-center flex-grow">
        <h1 className="text-lg font-semibold w-full">{title}</h1>
        <p className="text-sm text-gray-600">{formatDateTwo(date)}</p>
      </div>
    </div>
  );
}
