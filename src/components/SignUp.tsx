'use client'
import Image from 'next/image'
import { useState } from 'react'
import Login from './Login'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeLowVision } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '../supabase/supabaseClient'


export default function SignUp() {
    const [sign, setSign] = useState(true);
    const [log, setLog] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showcPass, setcShowPass] = useState(false);
    const [userInfo, setUserInfo] = useState ({
    fName: "",
    lName: "",
    email: "",
    password: "",
    cPassword: ""
    });

    const handleSignUp = async (e: React.FormEvent) => { // SIGN UP LOGIC
        e.preventDefault();
        
        const { fName, lName, email, password, cPassword} = userInfo;
          if (!userInfo.fName || !userInfo.lName || !userInfo.email || !userInfo.password) {
            toast.error('Please fill in all the fields');
            return;
        }
        
        if (userInfo.password !== userInfo.cPassword) { //CHECKS IF PASSWORDS MATCHES
            toast.error('Password Mismatch! Try Again.');
            return;
        } 
        
        const {data:signUpData, error: signUpError } = await supabase.auth.signUp({email, password}) // CREATES THE ACCOUNT TO SUPABASE
        
        if (signUpError) {
            toast.error(signUpError.message);
            return;
        }

        const userId = signUpData.user?.id; // GET THE GENERATED USER ID FROM SUPABASE

        if (!userId){
            toast.error('Unable to create user!');
            return;
        }


        const { error:insertError } = await supabase.from('gallery-user').insert([{ // ISERTING THE APPROPRIATE DATA FOR USER PROFILE
            user_id: userId,
            email: email,
            first_name: fName,
            last_name: lName,
        }]);

        if (insertError) {
            toast.error(`Unable to insert data! Error:${insertError.message}`);
            return;
        }
        toast.success('Successfully Signed up! Check your email to verify account!');
        setLog(true);
        setSign(false);

    }
    
  return (
    <>
    {sign && 
        <div className="w-1/3 h-3/4">
        <form onSubmit={handleSignUp} className="w-full h-fit bg-gray-200 py-4 px-8 rounded shadow-2xl">
            <div className="w-full flex flex-col items-center mb-6">
                <Image
                src='/brush.png'
                alt=""
                priority
                width={100}
                height={100}
                />
                <h1 className='text-3xl font-extrabold'>Sign Up</h1>
            </div>
            <div>
                <label htmlFor="fName" className="block" >First Name</label>
                <input 
                    type="text" 
                    id="fName"
                    pattern="[A-Za-z\s]+"
                    placeholder='Enter first name'
                    className='border w-full px-2 py-1 mb-2 rounded'
                    onChange={(e) => (setUserInfo(prev => ({...prev, fName:e.target.value})))}
                />

                <label htmlFor="lName" className="block">Last Name</label>
                <input 
                    type="text" 
                    id="lName" 
                    pattern="[A-Za-z\s]+"
                    placeholder='Enter last name'
                    required
                    maxLength={20}
                    className='border w-full px-2 py-1 mb-2 rounded'
                    onChange={(e) => (setUserInfo(prev => ({...prev, lName:e.target.value})))}
                />
                
                <label htmlFor="username" className="block">Email</label>
                <input 
                    type="email" 
                    id="username" 
                    required
                    placeholder='Enter email'
                    className='border w-full px-2 py-1 mb-2 rounded'
                    onChange={(e) => (setUserInfo(prev => ({...prev, email:e.target.value})))}
                />

                <div className="relative w-full h-auto" >
                <label htmlFor="password" className="block">Password</label>
                <input 
                    type={`${showPass? 'text': 'password'}`}
                    id="password"
                    required
                    minLength={8}
                    maxLength={12}
                    placeholder='Enter password'
                    className='border w-full px-2 py-1 mb-2 rounded' 
                    onChange={(e) => (setUserInfo(prev => ({...prev, password:e.target.value})))}
                />
                    <FontAwesomeIcon 
                        icon={showPass? faEye : faEyeLowVision} 
                        className="absolute right-4 bottom-4 cursor-pointer text-sm text-gray-600" 
                        onMouseDown={() => setShowPass(!showPass)} 
                        onMouseUp={() => setShowPass(!showPass)}
                    />
                </div>

                <div className="relative w-full h-auto ">
                    <label htmlFor="confirm-password" className="block">Confirm password</label>
                    <input 
                        type={`${showcPass? 'text': 'password'}`}
                        id="confirm-password"
                        placeholder='Confirm password'
                        required
                        className='border w-full px-2 py-1 mb-4 rounded' 
                        onChange={(e) => (setUserInfo(prev => ({...prev, cPassword:e.target.value})))}
                    />
                    <FontAwesomeIcon 
                        icon={showcPass? faEye : faEyeLowVision} 
                        className="absolute right-4 bottom-6 cursor-pointer text-sm text-gray-600" 
                        onMouseDown={() => setcShowPass(!showcPass)} 
                        onMouseUp={() => setcShowPass(!showcPass)}
                    />
                </div>
                

                <button type="submit" className="w-full px-2 py-1 bg-gray-700 mb-4 text-xl font-bold text-white rounded cursor-pointer hover:bg-gray-600">Sign Up</button>
                <p className="text-sm mb-4">Have an account already? <button className="underline text-blue-700 hover:text-blue-900 cursor-pointer" onClick={() => {setSign(!sign); setLog(!log)}}>Sign Up Here. </button></p>
            </div>
        </form>
    
    </div>}
    {log && <Login/>}
    </> )
}
