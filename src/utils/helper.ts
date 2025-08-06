
import { useState, useEffect } from "react"

export function usePagination<T>(items: T[], itemsPerPage: number) { // USE FOR PAGINATION LOGIC IN THE ARTWORK CONTAINER
    const [currentPage, setCurrentPage] = useState(1);


    const totalPages = Math.ceil(items.length/itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [items.length, totalPages, currentPage]);

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = items.slice(firstIndex, lastIndex);
    return {
        currentPage,
        setCurrentPage,
        currentItems,
        totalPages
    };
}

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, callback: () => void) { 

    useEffect(() => { // HANDLES THE EVENT OF MOUSEUP AND MOUSEDOWN OF A PARTICULAR COMPONENT
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)){
                callback();
            } 
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [ref, callback])
}

export function formatDate(date?: string) { // FORMATING THE DATA APPROPRIATELY
    return date ? new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : "";
}

export function formatDateTwo(date?: string) { // SAMES AS DATEFORMAT BUT ONLY GETS THE MONTH AND YEAR
    return date ? new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                }) : "";
}