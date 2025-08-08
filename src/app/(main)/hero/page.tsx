'use client'
import Image from 'next/image'
import About from '../about/page'

export default function Hero() {
  return (
    <>
    <div className="h-screen flex max-sm:h-[80vh] max-sm:flex-col-reverse max-sm:justify-center max-sm:pt-15 max-sm:items-center max-sm:gap-5 px-4 py-2 gap-2">
        <div className="p-2 w-[60%] max-sm:w-full flex justify-center items-center flex-col">
            <h1 className="max-sm:text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-shadow-2xs">Hi There!</h1>
            <h1 className="max-sm:text-[16px] sm:text-xl md:text-2xl lg:text-3xl font-bold text-shadow-2xs"> Welcome to Pol's Art Gallery</h1>
            <p className="max-sm:text-[11px] sm:text-[11px] md:text-[13px] text-center lg:text-base font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
        </div>
        <div className="w-[40%] max-sm:w-full flex items-center justify-center relative">
            <Image
            src="/brush.png"
            alt=""
            width={300} 
            height={300}
            className="max-sm:w-[200px] sm:w-[240px] md:w-[280px] lg:w-[300px]" />
            <Image
            src="/fine-arts.png"
            alt="painted rose in a canvas"
            width={100} 
            height={100}
            className="max-sm:w-[60px] max-sm:top-30 max-sm:left-[-25] sm:w-[70px] sm:top-30 sm:left-[-20] md:w-[90px] md:top-20 md:left-[-13] lg:w-[100px] lg:top-15 lg:left-[-15] absolute"/>
            <Image
            src="/mona-lisa.png"
            alt="mona lisa portrait"
            width={100} 
            height={100}
            className="max-sm:w-[50px] max-sm:top-32.5 max-sm:right-[-25] sm:w-[60px] sm:top-40 sm:right-[-45] md:w-[80px] md:top-25 md:right-[-50] lg:w-[100px] lg:top-20 lg-right-[-40] absolute"/>
            <Image
            src="/paint-bucket.png"
            alt="bucket paint"
            width={100} 
            height={100}
            className="max-sm:w-[60px] max-sm:top-[-70] sm:w-[70px] sm:bottom-30 md:w-[90px] md:bottom-20 lg:w-[100px] lg:bottom-10 absolute "/>
        </div>
    </div>
    <About/>
    </>
  )
}
