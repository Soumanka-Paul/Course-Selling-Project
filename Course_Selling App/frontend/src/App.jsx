import React from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses'
import Buy from "./components/Buy"
import Purchases from "./components/Purchases"
// import AdminSignup from "./admin/AdminSignup"  // Removed - signup disabled
import AdminLogin from "./admin/AdminLogin"
import Dashboard from "./admin/Dashboard"
import OurCourses from "./admin/OurCourses"
import UpdateCourse from "./admin/UpdateCourse"
import CourseCreate from "./admin/CourseCreate"


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        
        {/* User routes */}
        <Route path="/getcourse" element={<Courses/>} />
        <Route path="/buy/:courseId" element={<Buy/>} />
        <Route path="/purchased" element={<Purchases/>} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<Navigate to="/admin/login" replace />} />  {/* Redirect to login */}
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/updatecourse/:courseId" element={<UpdateCourse/>}/>
        <Route path="/admin/create-course" element={<CourseCreate/>}/>
        <Route path="/admin/our-courses" element={<OurCourses/>}/>
      </Routes>
      <Toaster/>
    </div>
  );
}

export default App