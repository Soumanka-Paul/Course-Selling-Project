import React, { useState } from 'react'
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/v1/admin/login", {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log("Login Successful", response.data);
      toast.success("Login Successful!");
      
      // Store token in localStorage
      localStorage.setItem("adminToken", response.data.token);
      
      // Clear form
      setEmail("");
      setPassword("");
      setErrorMessage("");
      navigate("/admin/dashboard");
    } catch (error) {
      console.log("Error:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
        toast.error(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      }
    }
  }

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
      <div className='h-screen container mx-auto flex items-center justify-center text-white'>
        {/* Header */}
        <header className='absolute top-0 left-0 w-full flex justify-between items-center p-5'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="CourseHub" className='w-10 h-10 rounded-full' />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              CourseHub
            </Link>
          </div>
          <div className='flex items-center font-bold'>
            <Link to={"/"} className='bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white hover:text-black transition'>
              Home
            </Link>
          </div>
        </header>
        
        {/*Login Form */}
        <div className='bg-gray-900 p-8 rounded-lg shadow-lg w-[500px]'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            Admin Login to <span className='text-amber-500'>CourseHub</span>
          </h2>
          <p className='text-center text-gray-400 mb-6'>🔒 Secure Admin Access</p>
          
          {errorMessage && (
            <div className='bg-red-500 text-white p-3 rounded mb-4'>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor="email" className='text-gray-400 mb-2 block'>Admin Email</label>
              <input 
                type="email"
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='admin@coursehub.com'
                required
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="password" className='text-gray-400 mb-2 block'>Password</label>
              <input 
                type="password"
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your password'
                required
              />
            </div>
            
            <button 
              type='submit' 
              className='w-full cursor-pointer bg-orange-500 hover:bg-blue-500 text-white py-3 px-6 rounded-md transition'>
              Login as Admin
            </button>
          </form>
          
          <p className='text-center text-gray-500 text-sm mt-6'>
            🔐 Authorized Access Only
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin