'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [select, setSelected] = useState('home');

  const handleSelect = (page: string) => { // HANDLES NAVIGATION
    setSelected(page);
  }

  return (
    <div className="flex w-full items-center text-center justify-between mt-4 pb-1.5 border-b-1">
      <div className="flex items-center gap-4">
        <Link href="/hero" onClick={() => handleSelect('home')}>
          <Image
            src="/icon.png"
            alt=""
            width={70}
            height={70}
          />
        </Link>
        
        <h1 className="text-3xl font-bold">Pol's Art Gallery</h1>
      </div>
      <div className="flex items-center">
        <ul 
          className="justify-center flex gap-6 text-xl font-light [&>*]:cursor-pointer  [&>*]:decoration-1">
            <Link href="/hero" onClick={() => handleSelect('home')}>
              <li className="relative group">Home 
                <span className={`group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'home' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} /> 
              </li>
            </Link>
            <Link href="/gallery" onClick={() => handleSelect('gallery')}>
              <li className="relative group">Gallery 
                <span className={`group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'gallery' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} />
              </li>
            </Link>
            <Link href="/about" onClick={() => handleSelect('about')}>
              <li className="relative group">About 
                <span className={`group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'about' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} />
              </li>
            </Link>
            <Link href="/account" onClick={() => handleSelect('account')}>
              <li className="relative group">Account 
                <span className={`group-hover:w-full transition-all duration-250 ease-in-out absolute bottom-0 left-0 ${select === 'account' ? 'w-full': 'w-0'} h-0.5 bg-gray-700 `} />
              </li>
            </Link>
        </ul>
      </div>
    </div>
  )
}
