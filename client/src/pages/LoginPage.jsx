import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState,setCurrState] = useState("Sign Up")
  const [fullName,setFullName] = useState("Duggu")
  const [email,setEmail] = useState("duggu@gmail.com")
  const [password,setPassword] = useState("duggu@12")
  const [bio,setBio] = useState("it is first account") 
  const [isDataSubmitted,setIsDataSubmitted] = useState()
  const {login} = useContext(AuthContext); 
  const onSubmitHandler=(e)=>{
     e.preventDefault();
     if(currState==="Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
     }
     console.log("now we are going to login/signup")
     login(currState==="Sign Up"?"signup":"login",{fullName,email,password,bio});
  }
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* --------left------- */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]"/>
      {/* --------right------- */}
      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
        {currState}
        {
          isDataSubmitted && <img src={assets.arrow_icon}  alt="" className="w-5 cursor-pointer" onClick={()=>setIsDataSubmitted(false)} />
        }
        </h2>
        {
          currState==="Sign Up" && !isDataSubmitted && (
            <input
             value={fullName}
             onChange={(e)=>setFullName(e.target.value)}
             type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder='Full Name' required/>
          )
        }
        {!isDataSubmitted && (
          <>
          <input
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           type="email" placeholder='Email Address' required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          <input
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           type="password" placeholder='Password' required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </>
        )}
        {
          currState==="Sign Up" && isDataSubmitted && (
            <textarea 
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder='provide a short bio...'></textarea>
          )
        }
          
        {/* 	Background gradient flows right */}
        <button className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {currState==="Sign Up"?"Create Account":"Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox"/>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-2">
          {currState==="Sign Up"?(
            <p className="text-sm text-gray-600">Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
          ):(
            <p className="text-sm text-gray-600">Create an account <span onClick={()=>setCurrState("Sign Up")}  className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
          )}
        </div>  
      </form>
    </div>
  )
}

export default LoginPage