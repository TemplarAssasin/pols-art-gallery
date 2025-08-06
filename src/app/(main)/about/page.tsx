'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function About() {
  const [select, setSelect] = useState({
    id: 2,
    image: "/mona-lisa.png",
    largeSize: 85,
    smallSize: 50,
  });

  const handleClick = (id: number, image: string) => { // HANDLES THE CHANGING OF PICTURE UPON CLICK IN ABOUT PAGE
    setSelect(prev => ({...prev, id: id, image: image}));
  }
  return (
      <div className="about-parent flex w-full h-[80vh] my-5 p-2 gap-2 rounded-xl ">
        <div className="w-1/2 h-full flex flex-col items-center justify-center gap-2">
            <div>
            <Image
            src={select.image}
            alt=""
            width={300} 
            height={300}
            className="about-main"/>
            </div>
            <div className="about-container flex [&>div] gap-2 items-center">
                <div 
                  onClick={() => handleClick(1, "/paint-bucket.png")} 
                  className={` ${select.id === 1? 'border-2 border-gray-500': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/paint-bucket.png"
                    alt=""
                    width={select.id === 1? select.largeSize: select.smallSize} 
                    height={select.id === 1? select.largeSize: select.smallSize}
                    className="about-bucket"/>
                </div>
                <div 
                  onClick={() => handleClick(2, "/mona-lisa.png")} 
                  className={` ${select.id === 2? 'border-2 border-gray-500': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/mona-lisa.png"
                    alt=""
                    width={select.id === 2? select.largeSize: select.smallSize} 
                    height={select.id === 2? select.largeSize: select.smallSize}
                    className="about-mona"/>
                </div>
                <div 
                  onClick={() => handleClick(3, "/fine-arts.png")} 
                  className={` ${select.id === 3? 'border-2 border-gray-500': 'border-none'} 
                  cursor-pointer w-fit p-1 rounded`}>
                    <Image
                    src="/fine-arts.png"
                    alt=""
                    width={select.id === 3? select.largeSize: select.smallSize} 
                    height={select.id === 3? select.largeSize: select.smallSize}
                    className="about-rose"
                    />
                </div>
            </div>
        </div>
        <div className="about-txtcont w-1/2 h-full flex flex-col items-center py-4 px-8 gap-4">
                <div>
                    <Image
                    src="/icon.png"
                    alt=""
                    width={150} 
                    height={150}
                    className="about-image"/>
                </div>
            <h2 className="about-text font-bold text-5xl mb-2 text-center">About <br/>Pol's Art Gallery</h2>
            <p className="about-description break-words text-justify indent-12 text-xl font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis illo, perferendis voluptate molestiae error vel obcaecati consequatur, fuga deleniti eveniet delectus ea praesentium doloribus modi, neque temporibus sint. Nemo magni doloribus deleniti aliquam, officiis quidem, repellat delectus sunt eos perferendis quos repellendus ad obcaecati non corporis quasi, impedit voluptates nesciunt.</p>
        </div>
    </div>
  )
}
