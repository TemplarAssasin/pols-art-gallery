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
      .limit(6);
      
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
      (<div className="w-full h-auto grid place-items-center">
        <p className="text-5xl font-bold">Loading...</p>
      </div>) :
      (
      <div className="account-mainparent relative w-full my-5 p-4">
        <div className="flex justify-between">
          <h1 className="account-title text-3xl font-extrabold uppercase">Account Profile</h1>
          <button 
                onClick={handleLogout}
                title="logout"
                className="account-logout px-2 py-1.5 text-gray-800 font-bold text-2xl rounded  cursor-pointer">
                  <FontAwesomeIcon icon={faArrowRightFromBracket}/>
          </button>
        </div>
        <div className="flex gap-8 flex-col w-full  mt-4">
          <div className="account-up flex w-full h-full  p-4 gap-8 border-b-2 border-gray-600">
              <div className=" bg-white  rounded-[50%] shadow-[0px_0px_3px_black]">
                <div className="account-profile grid place-items-center relative w-full h-full">
                  <Image
                    src={userData?.profile_url || '/brush.png'}
                    alt=""
                    priority
                    width={280}
                    height={280}
                    className="account-prof bg-white rounded-[50%] p-1" />
                  <FontAwesomeIcon 
                    icon={faCamera} 
                    onClick={changeProfile}
                    className="account-camera absolute cursor-pointer border-r-1 border-b-1  border-gray-400 bg-white rounded-[50%] shadow-2xl text-2xl px-2 py-2.5 bottom-9 right-2.5 hover:bg-gray-200 transition-all"/>
                   <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className=" grow-5 flex flex-col justify-center px-2">
                <span className=''>
                  <h3 className="account-label font-light text-xl">Name:</h3>
                  <p className="account-info font-normal text-xl ">{userData?.first_name + " " + userData?.last_name}</p>
                </span>
                <span>
                  <h3 className="account-label font-light text-xl">Email</h3>
                  <p className="account-info font-normal text-xl">{userData?.email}</p>
                </span>
                <span>
                  <h3 className="account-label font-light text-xl">Joined on:</h3>
                  <p className="account-info font-normal text-xl ">{formatDateCreation}</p>
                </span>
              </div>
              <div className="account-countcontainer relative w-1/4 rounded flex flex-col items-center bg-gray-100 shadow-2xl">
                  <div className=" w-full h-full flex flex-col justify-center items-center text-center p-2 text-black text-shadow-2xs">
                    <h1 className="account-countxt text-2xl font-extrabold uppercase break-words">Total Artworks</h1>
                    <p className="account-count text-7xl font-bold">{countData}</p>
                  </div>
              </div>
              
          </div>
          <div className="w-full min-h-[50%] flex flex-col gap-2 px-4">
            <h1 className="account-recenttitle font-bold text-3xl">Recent Artworks:</h1>
            <div className="account-recents w-full h-fit grid  grid-flow-row auto-rows-auto grid-cols-[repeat(6,1fr)] gap-x-2 [&>*]:rounded">
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
      </div>
      )
    }
      </>
  )
}
