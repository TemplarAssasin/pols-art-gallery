'use client'
import Image from 'next/image'
import { useState } from 'react'
import SignUp from './SignUp'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeLowVision } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '../supabase/supabaseClient'

export default function Login() {
  const [loginInfo, setLoginInfo] = useState ({
    email: "",
    password: "",
  })
  const [showPass, setShowPass] = useState(false);
  
  const [sign, setSign] = useState(false);
  const [log, setLog] = useState(true);
  const router = useRouter();
  
  const redirect = (e: React.FormEvent) => { // REDIRECTING TO HOME PAGE UPON SUCCESSFULL LOGIN
        e.preventDefault();
        router.push('/hero')
  };
  
  const handleLogin= async (e: React.FormEvent) => { // HANDLES LOGIN LOGIC AND ERROR HANDLING
    e.preventDefault();
    const {email, password} = loginInfo;

    if (!loginInfo.email || !loginInfo.password) {
        toast.error('Please fill out all the fields.');
        return;
    } 
    
    const { data, error } = await supabase.auth.signInWithPassword({ // CHECKS IF INPUT CREDENTIALS MATCHES OR VALID
        email: email,
        password: password,
    });
    if (error || !data.session) {
    if (error?.message === "Invalid login credentials") {
        toast.error("Invalid email or password. Please try again.");
    } else {
        toast.error(error?.message || "Login failed.");
    }
    console.log(error?.message);
    return;
    }

    const { data:userData } = await supabase.auth.getUser();

    if(userData?.user){
        console.log("Logged-in user:", userData.user);
        }  else {
        console.log("No user is logged in");
        }

    if (data.session){
        toast.success('Login Success!')
        redirect(e);
        }
  }

  return (
    <>
    {log && 
        <div className="login-container h-4/5">
        <form onSubmit={handleLogin} className="w-full h-fit bg-gray-200 py-4 px-8 rounded shadow-2xl">
            <div className="w-full flex flex-col items-center mb-8">
                <Image
                src='/brush.png'
                alt=""
                width={100}
                height={100}
                priority
                className="login-image"
                />
                <h1 className="login-title text-3xl font-extrabold">Sign In</h1>
            </div>
            <div>
                <label htmlFor="username" className="block login-inputTitle">Email</label>
                <input 
                    type="email" 
                    id="username"
                    placeholder="Enter your email" 
                    className='login-input border w-full px-2 py-1 mb-4 rounded'
                    onChange={(e) => {setLoginInfo(prev => ({...prev, email:e.target.value}))}}
                />
                <div className="relative h-fit">
                <label htmlFor="password" className="block login-inputTitle">Password</label>
                <input 
                    type={`${showPass? "text" : "password"}`}
                    id="password"
                    placeholder="Enter password" 
                    className='login-input border w-full px-2 py-1 mb-4 rounded'
                    onChange={(e) => {setLoginInfo(prev => ({...prev, password:e.target.value}))}}
                />
                <FontAwesomeIcon 
                    icon={showPass? faEye: faEyeLowVision}
                    onClick={() => setShowPass(!showPass)}
                    className="show-logpass absolute right-4 bottom-6 cursor-pointer text-sm text-gray-600"
                    />
                </div>
                <button 
                    type="submit" 
                    className="login-button w-full text-xl font-bold text-white px-2 py-1 bg-gray-700 mb-4 rounded hover:bg-gray-600 cursor-pointer">Login
                </button>
                
                <p className="login-text text-sm mb-4">Don't have an account yet? &nbsp;
                    <button 
                        className="underline text-blue-700 hover:text-blue-900 cursor-pointer" 
                        onClick={() => {setSign(!sign); setLog(!log)}}>Sign Up Here. 
                    </button>
                </p>
            </div>
        </form>
        
    </div>}
        {sign && <SignUp/>}
    </> )
}
