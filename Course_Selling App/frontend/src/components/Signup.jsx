import React, { useState } from 'react'
import logo from "../assets/logo.png";
import {Link,useNavigate} from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast';
const Signup = () => {
  const navigate = useNavigate();
  const [firstname,setFirstName] = useState("");
  const [lastname,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {  
        firstName: firstname,  
        lastName: lastname,
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log("Signup Successful", response.data);
       toast.success("Signup Sucessfull !");
      navigate("/");
      
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setErrorMessage("");
    } catch (error) {
  if (error.response) {
    const errMsg = error.response.data.message;

    if (Array.isArray(errMsg)) {
      setErrorMessage(errMsg.join(", "));
    } else {
      setErrorMessage(errMsg);
    }
  } else {
    setErrorMessage("Network error. Please try again.");
  }
}

  }

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
       <div className='h-screen container mx-auto flex  items-center justify-center text-white'>
            {/* Header */}
        <header className='absolute top-0 left-0 w-full flex justify-between items-center p-5'>
         <div className='flex items-center space-x-2'>
          <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              CourseHub
            </Link>
        </div>
         <div className='flex items-center space-x-10 font-bold'>
             <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
             <Link to={"/signup"} className=' bg-amber-500 text-white py-2 px-4 rounded hover:bg-green-400 duration-200'>Join now</Link>
         </div>
        </header>
        
        {/*Signup Form */}
        <div className='bg-gray-900 p-8 rounded-lg  shadow-lg w-[500px] '>
          <h2 className='text-2xl font-bold mb-4 text-center'>Welcome to <span className='text-amber-500'>CourseHub</span> </h2>
          <p className='text-center text-gray-400 mb-6'>Just Signup To Join Me!</p>
          
          {errorMessage && (
            <div className='bg-red-500 text-white p-3 rounded mb-4'>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor="firstname" className='text-gray-400 mb-2 block'>Firstname</label>
              <input 
                type="text"
                id='firstname'
                value={firstname}
                onChange={(e)=>setFirstName(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Type your firstname'
                required
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="lastname" className='text-gray-400 mb-2 block'>Lastname</label>
              <input 
                type="text"
                id='lastname'
                value={lastname}
                onChange={(e)=>setLastName(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Type your lastname'
                required
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="email" className='text-gray-400 mb-2 block'>Email</label>
              <input 
                type="email"
                id='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='name@email.com'
                required
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="password" className='text-gray-400 mb-2 block'>Password</label>
              <input 
                type="password"
                id='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='********'
                required
              />
            </div>
            <button 
              type='submit' 
              className='w-full cursor-pointer bg-orange-500 hover:bg-blue-500 text-white py-3 px-6 rounded-md transition'>
              Signup
            </button>
          </form>
        </div>
       </div>
    </div>
  )
}

export default Signup