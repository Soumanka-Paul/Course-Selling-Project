// admin/OurCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OurCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/course/getcourse", {
        withCredentials: true
      });
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching courses:", error);
      toast.error("Failed to load courses");
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:3000/api/v1/course/delete/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.log("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Our Courses</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link to="/admin/dashboard" className="py-4 px-1 text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/admin/our-courses" className="border-b-2 border-blue-500 py-4 px-1 text-blue-600 font-medium">
              Courses
            </Link>
            <Link to="/admin/create-course" className="py-4 px-1 text-gray-600 hover:text-blue-600">
              Create Course
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Total Courses: {courses.length}</h2>
          <Link
            to="/admin/create-course"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No courses created yet</p>
            <Link
              to="/admin/create-course"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-blue-600">₹{course.price}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/updatecourse/${course._id}`}
                      className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OurCourses;