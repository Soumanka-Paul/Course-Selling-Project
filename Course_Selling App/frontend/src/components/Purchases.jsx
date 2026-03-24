import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Purchases = () => {
  const navigate = useNavigate();

  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    fetchPurchasedCourses(token);
  }, [navigate]);

  const fetchPurchasedCourses = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/purchased",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setPurchasedCourses(response.data.courseData || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load purchased courses"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("jwt");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex">
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="logo" className="rounded-full h-12 w-12" />
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/getcourse" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/purchased" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>

            <li>
              <button className="flex items-center" onClick={handleLogout}>
                <IoLogOut className="mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">My Purchases</h1>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search your courses..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4">
                <FiSearch />
              </button>
            </div>

            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : purchasedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FaDownload className="text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No courses purchased yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="font-bold mb-2">{course.title}</h2>

                    <p className="text-sm text-gray-600 mb-3">
                      {course.description}
                    </p>

                    <p className="font-bold text-blue-600 mb-3">
                      ₹{course.price}
                    </p>

                    <a
                      href="https://youtube.com/playlist?list=PLdApYv7xlLnTJJpzATjptlKGAnwCtH3h7"
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center bg-blue-600 text-white py-2 rounded-lg"
                    >
                      Start Learning
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Purchases;