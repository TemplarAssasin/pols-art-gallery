'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function About() {
  const [select, setSelect] = useState({
    id: 2,
    image: "/mona-lisa.png",
    largeSize: 100,
    smallSize: 50,
  });

  const handleClick = (id: number, image: string) => { // HANDLES THE CHANGING OF PICTURE UPON CLICK IN ABOUT PAGE
    setSelect(prev => ({...prev, id: id, image: image}));
  }
  return (
      <div className=" md:h-screen max-sm:flex-col-reverse sm:flex-col-reverse md:flex-row flex items-center my-5 px-2 py-8 gap-2  ">
        <div className="max-sm:w-full max-sm:flex-col sm:flex-row sm:gap-8 sm:w-full w-1/2 h-full flex md:flex-col items-center justify-center gap-2">
            <div className='border-double border-12 border-gray-200 bg-gray-950 rounded-md p-6'>
            <Image
            src={select.image}
            alt=""
            width={300} 
            height={300}
            className="max-sm:w-[150px] sm:w-[170px] md:w-[160px] lg:w-[250px] "/>
            </div>
            <div className="max-sm:flex-row sm:flex-col md:flex-row flex gap-2 items-center">
                <div 
                  onClick={() => handleClick(1, "/paint-bucket.png")} 
                  className={` ${select.id === 1? 'border-2 border-gray-600': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/paint-bucket.png"
                    alt=""
                    width={select.id === 1? select.largeSize: select.smallSize} 
                    height={select.id === 1? select.largeSize: select.smallSize}
                    className={`${select.id ===1 ? "max-sm:w-[60px] sm:w-[80px] md:w-[90px] lg:w-[100px]" : "max-sm:w-[40px] sm:w-[45px] md:w-[50px] lg:w-[50px]"}`}/>
                </div>
                <div 
                  onClick={() => handleClick(2, "/mona-lisa.png")} 
                  className={` ${select.id === 2? 'border-2 border-gray-600': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/mona-lisa.png"
                    alt=""
                    width={select.id === 2? select.largeSize: select.smallSize} 
                    height={select.id === 2? select.largeSize: select.smallSize}
                    className={`${select.id ===2 ? "max-sm:w-[60px] sm:w-[80px] md:w-[90px] lg:w-[100px]" : "max-sm:w-[40px] sm:w-[45px] md:w-[50px] lg:w-[50px]"}`}/>
                </div>
                <div 
                  onClick={() => handleClick(3, "/fine-arts.png")} 
                  className={` ${select.id === 3? 'border-2 border-gray-600': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/fine-arts.png"
                    alt=""
                    width={select.id === 3? select.largeSize: select.smallSize} 
                    height={select.id === 3? select.largeSize: select.smallSize}
                    className={`${select.id ===3 ? "max-sm:w-[60px] sm:w-[80px] md:w-[90px] lg:w-[100px]" : "max-sm:w-[40px] sm:w-[45px] md:w-[50px] lg:w-[50px]"}`}
                    />
                </div>
            </div>
        </div>
        <div className="max-sm:w-full sm:w-[80%] w-1/2 h-full flex flex-col justify-center items-center py-4 px-8 gap-4">
                <div>
                    <Image
                    src="/icon.png"
                    alt="brush icon"
                    width={200} 
                    height={200}
                    className="max-sm:w-[130px] sm:w-[140px] md:w-[150px] lg:w-[200px]"/>
                </div>
            <h2 className="max-sm:text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">Pol's Art Gallery</h2>
            <p className="max-sm:text-[13px] sm:text-sm md:text-sm lg:text-base text-justify indent-12 font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis illo, perferendis voluptate molestiae error vel obcaecati consequatur, fuga deleniti eveniet delectus ea praesentium doloribus modi, neque temporibus sint. Nemo magni doloribus deleniti aliquam, officiis quidem, repellat delectus sunt eos perferendis quos repellendus ad obcaecati non corporis quasi, impedit voluptates nesciunt.</p>
        </div>
    </div>
  )
}
