'use client'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faCamera } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '@/src/supabase/supabaseClient'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Card from '@/src/components/Card';

export default function Account() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [countData, setCountData] = useState<any>(null);

  useEffect(() => { 
    const getUserData = async () => {
      
      const { data: {user}, error:userError} = await supabase.auth.getUser(); // CHECKS IF THERE IS A LOGGED IN USER
      if (userError || !user){
        console.log(userError?.message);
        toast.error("No logged in User");
        return;
      }

      const { data, error } = await supabase.from('gallery-user').select('*').eq('user_id', user.id).single(); // RETRIEVE THE DATA OF THE LOGGED IN USER

      if (error) {
        console.log(`Error: ${error.message}`);
        toast.error("Failed to load user data!");
      } else {
        console.log(data);
        setUserData(data);
      }
    };

    getUserData();
  },[]);


  const formatDateCreation = new Date(userData?.created_at).toLocaleDateString("en-US",{ // FORMATTING DATE
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handleLogout = async () => { // HANDLES SESSION ENDING OR LOGGING OUT OF USER AND ALSO REDIRECTING TO LOGIN PAGE
  const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    }else{
      router.push('/login')
      toast.success("Logout Success")
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const changeProfile = () => { // REFERENCING INPUT FILE FOR CHANGING PROFILE PICTURE
    fileInputRef.current?.click();
  }
  const [getData, setGetData] = useState<any>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { // HANDLES UPLOADING AND CHANGING OF PROFILE PICTURE
    const file = event.target.files?.[0];

    if(!file || !userData) return; 

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) { //CHECKS IF IT EXCEEDS THE MAXIMUM FILE SIZE SET
      toast.error(`File size exceeds ${maxSizeInMB}MB limit.`);
      return;
    }

    const fileExt = file.name.split('.').pop(); // CREATING A UNIQUE URL_NAME FOR THE PROFILE PICTURE
    const fileName = `${userData.user_id}.${fileExt}`;
    const filePath = `avatar/${fileName}`;

    const { data, error} = await supabase.storage.from('artwork-profile').upload(filePath, file, {upsert:true}); // UPLOADING OF PROFILE PICTURE

    if(error) {
      toast.error(`Upload failed: ${error.message}`);
      return;
    }
    const { data:publicUrlData } = await supabase.storage.from('artwork-profile').getPublicUrl(filePath);
    const basePublicUrl = publicUrlData?.publicUrl;
    const publicUrl = `${basePublicUrl}?v=${Date.now()}`;

    const { error:updateError} = await supabase.from('gallery-user').update({profile_url: publicUrl}).eq('user_id', userData.user_id); // UPDATES THE PROFILE URL DATA IN THE USER TABLE

    if(updateError){
      toast.error(`Error Uploading Profile: ${updateError.message}`);
      return;
    }else{
      setUserData((prev:any) => ({...prev, profile_url: publicUrl}));
      toast.success("Successfully Changed Profile.")
    }

  };

    useEffect(() => { // HANDLES THE RENDERING OF RECENT ARTWORKS OF THE LOGGED IN USER AS WELL AS COUNTING ALL THE ARTWORKS THE USER UPLOADED
    const displayRecent = async () => {
      if (!userData?.email) return;

      const { data:recentData , error:recentError } = await supabase
      .from('gallery')
      .select('*')
      .eq('email', userData?.email)
      .order('created_at', { ascending: false })
      .limit(4);
      
      const { count:countData, error:countError } = await supabase
      .from('gallery')
      .select('*', { count: 'exact', head: true })
      .eq('email', userData?.email);


      if (recentError || countError) {
        toast.error("Failed to retrieve recent artworks:");
        return
      }

      setGetData(recentData);
      setCountData(countData);
    }

    displayRecent();
  },[userData]);


  return (
     <>{!userData ? 
      (<div className="h-screen grid place-items-center">
        <p className="max-sm:text-base sm:text-xl md:text-3xl lg:text-5xl font-bold">Loading...</p>
      </div>) :
      (
      <div className="my-5 p-4">

        <div className="flex justify-between items-center">
          <h1 className="max-sm:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase">Account Profile</h1>
          <button 
                onClick={handleLogout}
                title="logout"
                className="max-sm:text-base sm:text-base md:text-xl lg:text-3xl px-2 py-1.5 text-gray-800 font-bold  rounded  cursor-pointer">
                  <FontAwesomeIcon icon={faArrowRightFromBracket}/>
          </button>
        </div>

        <div className=" w-full  max-sm:justify-center max-sm:flex-col max-sm:items-center justify-between flex gap-2 mt-4 px-2 py-4 border-b-1">
              <div className=" flex w-fit h-fit items-center justify-center relative bg-white rounded-[50%] shadow-[0px_0px_3px_black]">
                  <Image
                    src={userData?.profile_url || '/brush.png'}
                    alt="profile picture"
                    priority
                    width={200}
                    height={200}
                    className="max-sm:w-[180px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-red rounded-[50%] p-1" />

                  <FontAwesomeIcon 
                    icon={faCamera} 
                    onClick={changeProfile}
                    className="max-sm:text-xl max-sm:bottom-2 max-sm:right-0.5 sm:text-sm sm:bottom-4.5 sm:right-0.5 md:bottom-4.5 md:right-0.5 md:text-base lg:text-2xl lg:bottom-4.5 lg:right-0.5 absolute cursor-pointer border-r-1 border-b-1  border-gray-400 bg-white rounded-[50%] shadow-2xl px-1.5 py-2  hover:bg-gray-200 transition-all"/>
                   <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
              </div>
              <div className="flex lg:grow-1  lg:justify-around">
                <div className=" flex flex-col justify-center px-2">
                  <span className=''>
                    <h3 className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl font-light">Name:</h3>
                    <p className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl  font-normal">{userData?.first_name + " " + userData?.last_name}</p>
                  </span>
                  <span>
                    <h3 className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl  font-light ">Email</h3>
                    <p className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl  font-normal ">{userData?.email}</p>
                  </span>
                  <span>
                    <h3 className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl  font-light ">Joined on:</h3>
                    <p className="max-sm:text-[11px] sm:text-sm md:text-base lg:text-xl  font-normal  ">{formatDateCreation}</p>
                  </span>
                </div>
                
                <div className=" rounded flex flex-col items-center justify-center bg-gray-100 shadow-2xl">
                    <div className=" w-full h-full flex flex-col justify-center items-center text-center p-2 text-black text-shadow-2xs">
                      <h1 className="sm:text-base md:text-xl lg:text-2xl font-extrabold uppercase">Total Artworks</h1>
                      <p className="sm:text-4xl md:text-5xl lg:text-7xl font-bold">{countData}</p>
                    </div>
                </div>
              </div>
        </div>

        <div className=" flex flex-col gap-2 px-2 py-4">
          <h1 className="max-sm:text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold ">Recent Posts:</h1>
          <div className="max-sm:grid-rows-[repeat(1,250px)] max-sm:grid-cols-[repeat(1,225px)] max-sm:auto-rows-[250px]
                          sm:grid-rows-[repeat(1,220px)] sm:grid-cols-[repeat(2,225px)] sm:auto-rows-[220px] 
                          md:auto-rows-[250px] md:grid-rows-[repeat(1,250px)] md:grid-cols-[repeat(2,250px)] 
                          lg:grid-cols-[repeat(4,212px)] lg:grid-rows-[repeat(1,280px)]
                          grid  grid-flow-row   gap-2 [&>*]:rounded place-content-center ">
            { getData?.map((data:any) => {
              return (
              <Card
                key={data.id}
                title={data.title}
                date={data.date} 
                image_url={data.image_url}
                showDelete={false}
              />
              )
            })
            }
          </div>
        </div>
        
      </div>
      )
    }
    </>
  )
}