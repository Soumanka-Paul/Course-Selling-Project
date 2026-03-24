// admin/UpdateCourse.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpdateCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    fetchCourse();
  }, [courseId, navigate]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/course/${courseId}`, {
        withCredentials: true
      });
      const course = response.data.course;
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price
      });
      setCurrentImage(course.image.url);
      setFetchLoading(false);
    } catch (error) {
      console.log("Error fetching course:", error);
      toast.error("Failed to load course");
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (image) {
        data.append('image', image);
      }

      await axios.put(`http://localhost:3000/api/v1/course/update/${courseId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      toast.success("Course updated successfully!");
      navigate("/admin/our-courses");
      setLoading(false);
    } catch (error) {
      console.log("Error updating course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (fetchLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Update Course</h1>
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
            <Link to="/admin/our-courses" className="py-4 px-1 text-gray-600 hover:text-blue-600">
              Courses
            </Link>
            <Link to="/admin/create-course" className="py-4 px-1 text-gray-600 hover:text-blue-600">
              Create Course
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-6">Edit Course Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Course Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course description"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Current Image</label>
              <div className="mb-4">
                <img 
                  src={currentImage} 
                  alt="Current course" 
                  className="w-48 h-48 object-cover rounded-lg shadow"
                />
              </div>
              
              <label className="block text-gray-700 font-semibold mb-2">Update Image (Optional)</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 text-sm mt-1">
                Leave empty to keep current image. Upload PNG or JPG only.
              </p>
              {image && (
                <p className="text-green-600 text-sm mt-2">
                  New image selected: {image.name}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Course"}
              </button>
              <Link
                to="/admin/our-courses"
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold text-center hover:bg-gray-400 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateCourse;