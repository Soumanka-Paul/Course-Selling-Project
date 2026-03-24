import React, { useEffect ,useState} from 'react'
import logo from "../assets/logo.png";
import {Link} from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';

const Home = () => {
  const [courses ,setCourses] = useState([]);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(()=>{
     const token = localStorage.getItem("jwt");
     const adminToken = localStorage.getItem("adminToken");
     
     if(token){
       setIsLoggedIn(true);
     } else{
       setIsLoggedIn(false);
     }
     
     if(adminToken){
       setIsAdminLoggedIn(true);
     } else{
       setIsAdminLoggedIn(false);
     }
  },[])
  
  //Fetch Course //
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/course/getcourse", {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/logout", {}, {
        withCredentials: true,
      });
      
      toast.success(response.data.message);
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.message || "Logout Error");
    }
  }
  
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    toast.success("Admin logged out successfully");
  }
  
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 3000
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          autoplay: true,
          autoplaySpeed: 3000
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000
        }
      }
    ]
  };
  
  return (
    <div className='bg-gradient-to-r from-black to-blue-950 '>
      <div className='min-h-screen text-white container mx-auto'>
        {/* Header */}
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-amber-500 font-bold'>CourseHub</h1>
          </div>
          
          <div className='flex items-center space-x-4 font-bold'>
            {/* Admin Access Button */}
            {isAdminLoggedIn ? (
              <div className='flex items-center space-x-2'>
                <Link
                  to="/admin/dashboard"
                  className="bg-purple-600 text-white text-xs md:text-sm md:py-2 md:px-4 p-2 rounded flex items-center hover:bg-purple-700 transition"
                >
                  <RiAdminFill className='mr-1' /> Dashboard
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-600 text-white text-xs md:text-sm md:py-2 md:px-4 p-2 rounded hover:bg-red-700 transition"
                >
                  Admin Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/admin/login"
                  className="bg-purple-600 text-white text-xs md:text-sm md:py-2 md:px-4 p-2 rounded flex items-center hover:bg-purple-700 transition"
                >
                  <RiAdminFill className='mr-1' /> Admin
                </Link>
                
                {/* User Login/Logout - Only show when admin is NOT logged in */}
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded hover:bg-white hover:text-black transition"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded hover:bg-white hover:text-black transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded hover:bg-white hover:text-black transition"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </header>

        {/* Main Section */}
        <section className='text-center mt-10'>
          <h1 className='text-4xl font-semibold text-orange-400'>CourseHub</h1>
          <br/>
          <p className='text-gray-500 py-3'>Unlock your future with expert-led courses that deliver results.</p>
          <div className='space-x-4 mt-8'>
            <Link to="/getcourse" className='bg-white py-3 px-6 cursor-pointer text-black rounded font-semibold hover:bg-green-500 duration-500 hover:text-white'>
              Explore courses
            </Link>
            <a href="https://youtube.com/playlist?list=PLdApYv7xlLnTJJpzATjptlKGAnwCtH3h7&si=5eGNb87-YV1K0mzC" target="_blank" rel="noopener noreferrer" className='bg-green-500 py-3 px-6 cursor-pointer text-white rounded font-semibold hover:bg-white duration-500 hover:text-black inline-block'>
              Course videos
            </a>
          </div>
        </section>
        
        <section className='mt-10 mb-5'>
          <Slider {...settings}>
            {courses.map((course) => {
              return (
                <div key={course._id} className='px-2'>
                  <div className='relative flex-shrink-0 w-full transition-transform duration-300 hover:scale-105'>
                    <div className='bg-gray-900 rounded-lg overflow-hidden'>
                      <img className='h-28 mt-2 rounded-lg w-full object-contain' src={course.image.url} alt={course.title} />
                      <div className='p-6 text-center'>
                        <h2 className='text-xl font-bold mb-2.5 text-white'>{course.title}</h2>
                        <Link to={`/buy/${course._id}`} className='mt-4 bg-orange-500 cursor-pointer text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300 inline-block'>
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>

        {/* Footer */}
        <hr/>
        <footer className='my-8 mt-10'>
          <div className='grid grid-cols-1 md:grid-cols-3'>
            <div className='flex flex-col items-center md:items-start'>
              {/* Logo and Brand */}
              <div className='flex items-center space-x-2 mb-4'>
                <img src={logo} alt="CourseHub Logo" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl font-bold text-orange-400'>CourseHub</h1>
              </div>
              
              {/* Social Media Section */}
              <div className='flex flex-col items-center md:items-start'>
                <p className='mb-2 text-white'>Follow me</p>
                <div className='flex space-x-4 text-xl'>
                  <a href="https://www.facebook.com/share/1FHCaf9MQe/" target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition duration-300 hover:text-blue-500 hover:text-3xl'>
                    <FaFacebook />
                  </a>
                  <a href="https://www.instagram.com/soumankapaul" target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition duration-300 hover:text-pink-600 hover:text-3xl'>
                    <FaInstagram />
                  </a>
                  <a href="https://wa.me/6296882904" target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition duration-300 hover:text-green-400 hover:text-3xl'>
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
            
            <div className='flex flex-col'>
              <h3 className='text-lg font-semibold mb-4'>Connects</h3>
              <ul className='space-y-2 text-gray-400'>
               <li className='hover:text-white cursor-pointer duration-300'>
  <a href="mailto:paulsoumanka@gmail.com">Gmail: paulsoumanka@gmail.com</a>
</li>
<li className='hover:text-white cursor-pointer duration-300'>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    Insta: soumankapaul
  </a>
</li>
          <li className='hover:text-white cursor-pointer duration-300'>
  <a href="https://github.com/Soumanka-Paul">GitHub : Soumanka-Paul</a>
</li>

                <li className='hover:text-white cursor-pointer duration-300'>WhatsApp: 6296882904</li>
              </ul>
            </div>
            
            <div className='flex flex-col'>
              <h3 className='text-lg font-semibold mb-4'>Copyrights © 2025</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300'>Terms & Conditions</li>
                <li className='hover:text-white cursor-pointer duration-300'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer duration-300'>Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
