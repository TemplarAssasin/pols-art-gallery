'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import Card from "./Card"
import PopCard from './PopCard';
import { fetchGalleryData } from '@/src/utils/crud-function';
import { GalleryItem } from '@/src/types/variable-types';
import { usePagination, useClickOutside } from '@/src/utils/helper';
import { supabase } from '../supabase/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faArrowDownAZ, faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import Form from './InputForm'


export default function CardContainer() {
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState(false);
    const [selected, setSelected] = useState<GalleryItem | null>(null);
    const [add, setAdd] = useState(false);
    const [filterDate, setFilterDate] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const filteredGallery = useMemo(() => { // HANDLES FILTERING OF DATA BASED ON DATE
    let result = [...gallery];
  
    if (filterDate) {
        const selectedYear = parseInt(filterDate);
        result = result.filter(item => new Date(item.date).getFullYear() === selectedYear);
    }

    result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return result;
    }, [gallery, filterDate, sortAsc]);

    const { // OBJECT DESTRUCTURING AND PARAMETER PASSING FOR PAGE PAGINATION
        currentPage,
        setCurrentPage,
        currentItems: currentCards,
        totalPages
    } = usePagination(filteredGallery, 12)

    useEffect(() => {
    setCurrentPage(1);
    }, [filterDate]);

    const uniqueYears = useMemo(() => { //FILTERS ALSO DATA
    return Array.from(
        new Set(gallery.map(item => new Date(item.date).getFullYear()))
    ).sort((a, b) => b - a);
    }, [gallery]);



    useEffect(() => { // FETCHES GALLERY DATA FROM DATABASE
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchGalleryData();
            setGallery(data);
            setIsLoading(false);
        }
        loadData() 
    },[]);

    useEffect(() => {//RESPONSIBLE FOR THE WEB APP REALTIME UPDATES
    const channel = supabase
        .channel('realtime-gallery')
        .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'gallery',
        },
        async (payload) => {
            const newItem = payload.new as GalleryItem;

            const updatedData = await fetchGalleryData();
            setGallery(updatedData);

            if (selected && newItem.id === selected.id) {
            const { data: updatedItem, error } = await supabase
                .from('gallery')
                .select('*')
                .eq('id', selected.id)
                .single();

            if (!error && updatedItem) {
                setSelected(updatedItem);
            }
            }
        }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
    }, [selected]);

    const handlePopCard = (cardData: GalleryItem) => { // HANDLES THE RENDERING OF POPCARD COMPONENT ONCLICK OF THE CARD
        setSelected(cardData);
        setState(true);
    }

    const popCardRef = useRef<HTMLDivElement>(null);
    useClickOutside(popCardRef, () => {
        setState(false);
        setSelected(null)
    })


  return (
    <section className={`w-full ${currentCards.length === 0 ? 'h-[94vh]': 'h-fit '} flex flex-col items-center relative bg-white shadow-[1px_1px_5px_gray] py-2 px-2 rounded-md mb-4`}>
        <div className="flex  w-full items-center justify-between px-5 mt-3">
            { currentCards.length !== 0 ?
                <div className="flex gap-4">
                    
                    <button 
                    onClick={() => setSortAsc(prev => !prev)}
                    className="w-fit h-fit px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-bold shadow-[0px_0px_2px_black] cursor-pointer"
                        >
                    {sortAsc ? <FontAwesomeIcon icon={faArrowUpAZ}/>: <FontAwesomeIcon icon={faArrowDownAZ}/>}
                    </button>
                    
                    <select
                            className="w-fit h-fit shadow-[0px_0px_2px_black] px-3 py-2  bg-gray-300 rounded-md font-bold text-base  cursor-pointer"
                            onChange={(e) =>
                                setFilterDate(e.target.value === "all" ? null : e.target.value)
                            }
                            >
                            <option value="all" >All</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year.toString()}>
                                {year}
                                </option>
                            ))}
                    </select> 
                </div> 
                : <div></div>
            }
        <div>
        <FontAwesomeIcon 
            icon={faPlus} 
            className="text-gray-800 text-3xl cursor-pointer z-98 hover:text-black hover:scale-110 transition-all ease-in-out duration-300" 
            onClick={() => setAdd(!add)}/>
        {add && <Form />}
        </div>
        </div>
        <div 
            className="text-3xl font-bold place-items-center w-full p-4  grid grid-cols-4 gap-4 grid-rows-2 grid-flow-row auto-rows-auto">
        { isLoading ? "Loading..." :  
        currentCards.length === 0 ? "No artworks yet" :  
        (
        currentCards.map((card) => (
            <Card 
                onClick={() => handlePopCard(card)} 
                key={card.id} 
                id= {card.id} 
                title={card.title} 
                date={card.date} 
                image_url={card.image_url}/>
        )))
        
        }
        {state && 
            <div ref={popCardRef}>
                <PopCard    
                id={selected?.id} 
                description={selected?.description} 
                title={selected?.title} 
                date={selected?.date} 
                image_url={selected?.image_url}
                />
            </div>
        }
        </div>
        
        <div className=" flex gap-2 ">
        {Array.from({length: totalPages}, (_,i) => ( 
            <button
                key={i}
                onClick={() => setCurrentPage(i+1)}
                className={`text-xl cursor-pointer font-semibold px-4 py-2 rounded-md ${totalPages > 1? 'block' : 'hidden'} ${currentPage === i + 1 ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
                {i + 1}
            </button>
        ))}
        </div>
    </section>
  )
  
}
