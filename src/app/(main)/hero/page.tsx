'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <main>
    <div className="flex w-full h-[80vh] my-5 p-2 gap-2">
        <div className="w-1/2 h-full flex justify-center items-center flex-col">
            <h1 className="font-bold text-3xl text-shadow-2xs">Hi There! Welcome to Pol's Art Gallery</h1>
            <p className="font-light text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, earum!</p>
        </div>
        <div className="w-1/2 h-full  grid place-items-center relative">
            <Image
            src="/brush.png"
            alt=""
            width={300} 
            height={300}/>
            <Image
            src="/fine-arts.png"
            alt=""
            width={100} 
            height={100}
            className="absolute top-15 left-2"/>
            <Image
            src="/mona-lisa.png"
            alt=""
            width={110} 
            height={110}
            className="absolute top-15 right-10 rotate-[-20deg]"/>
            <Image
            src="/paint-bucket.png"
            alt=""
            width={90} 
            height={90}
            className="absolute bottom-0 left-1/4 "/>
        </div>
    </div>
    </main>
  )
}
