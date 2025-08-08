'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [select, setSelected] = useState('home');
  const [menu, setMenu] = useState(false);

  const handleSelect = (page: string) => { // HANDLES NAVIGATION
    setSelected(page);
  }

  return (
    <div className="flex w-full h-[4.5rem] items-center text-center justify-between mt-4 pb-1.5 border-b-1">
      <div className="flex items-center gap-4">
        <Link href="/hero" onClick={() => handleSelect('home')}>
          <Image
            src="/icon.png"
            alt=""
            width={70}
            height={70}
            className="max-sm:w-[55px] sm:w-[60px] md:w-[65px] lg:w-[70px]"
          />
        </Link>
        <h1 className="max-sm:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Pol's Art Gallery</h1>
      </div>

      <div className={`${menu ? 'translate-x-0' : 'translate-x-full'}
          fixed top-0 right-0 h-screen w-[50vw] bg-white z-50 transition-transform duration-500
          md:static md:flex md:translate-x-0 md:bg-transparent md:h-auto md:w-auto md:p-0
        `}>
        <button 
          className=" md:hidden text-[22px] absolute top-5 left-4 z-[60]" 
          onClick={() => setMenu(!menu)}
        >
          ✕
        </button>
         <ul className="max-md:text-base md:text-lg lg:text-xl flex flex-col md:flex-row gap-6  font-light [&>*]:cursor-pointer [&>*]:decoration-1 mt-16 md:mt-0 px-6">
            <Link href="/hero" onClick={() => handleSelect('home')}>
              <li className="relative group">Home 
                <span className={`max-md:hidden  group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'home' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} /> 
              </li>
            </Link>
            <Link href="/gallery" onClick={() => handleSelect('gallery')}>
              <li className="relative group">Gallery 
                <span className={`max-md:hidden group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'gallery' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} />
              </li>
            </Link>
            <Link href="/account" onClick={() => handleSelect('account')}>
              <li className="relative group">Profile 
                <span className={`max-md:hidden group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'account' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} />
              </li>
            </Link>
        </ul>
      </div>
       {!menu && (
        <button
          className="md:hidden text-[26px] absolute top-8 right-4 z-[60] transition-all duration-500"
          onClick={() => setMenu(true)}
        >
          ☰
        </button>
      )}
    </div>
  )
}
