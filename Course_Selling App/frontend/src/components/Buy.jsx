import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from "react-hot-toast";
import axios from "axios";
import { FaCopy, FaCheckCircle } from "react-icons/fa";

const Buy = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const token = localStorage.getItem("jwt");
  const YOUR_UPI_ID = "paulsoumanka-1@oksbi";

  // Verify user authentication FIRST
  useEffect(() => {
    if (!token) {
      toast.error("Please login to purchase courses");
      // Save current location to redirect back after login
      navigate("/login", { state: { from: `/buy/${courseId}` } });
      return;
    }
    
    
    // Token exists, user is logged in
    setIsLoggedIn(true);
    setVerifying(false);
  }, [token, navigate, courseId]);

  // Fetch course details only after user is verified
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchCourse = async () => {
      try {
        // Using courseID to match the backend route parameter
        const response = await axios.get(`http://localhost:3000/api/v1/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setCourse(response.data.course);
      } catch (error) {
        console.log("Error fetching course:", error);
        toast.error("Failed to load course details");
        if (error.response?.status === 404) {
          toast.error("Course not found");
          navigate("/");
        }
      }
    };

    fetchCourse();
  }, [courseId, isLoggedIn, token, navigate]);

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to purchase the course");
      navigate("/login", { state: { from: `/buy/${courseId}` } });
      return;
    }

    if (!transactionId || !upiId) {
      toast.error("Please enter transaction ID and your UPI ID");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/v1/course/buy/${courseId}`,
        {
          transactionId,
          upiId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      toast.success(response.data.message || "Payment submitted successfully!");
      navigate("/purchased");
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.log("Purchase error:", error);

      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || error.response?.data?.errors);
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("jwt");
        navigate("/login", { state: { from: `/buy/${courseId}` } });
      } else {
        toast.error(error.response?.data?.message || "Error submitting payment");
      }
    }
  };

  // Show loading state while verifying user
  if (verifying) {
    return (
      <div className='min-h-screen bg-gradient-to-r from-black to-blue-950 flex items-center justify-center'>
        <div className='text-white text-xl'>Verifying user...</div>
      </div>
    );
  }

  // Don't render the form if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-black to-blue-950 flex items-center justify-center p-4'>
      <div className='bg-gray-900 rounded-lg shadow-2xl p-8 max-w-2xl w-full'>
        {/* Course Details */}
        {course && (
          <div className='mb-8 text-center'>
            <img 
              src={course.image.url} 
              alt={course.title} 
              className='w-32 h-32 object-cover rounded-lg mx-auto mb-4'
            />
            <h2 className='text-2xl font-bold text-white mb-2'>{course.title}</h2>
            <p className='text-3xl font-bold text-green-400'>₹{course.price}</p>
          </div>
        )}

        {/* Payment Instructions */}
        <div className='bg-gray-800 rounded-lg p-6 mb-6'>
          <h3 className='text-xl font-bold text-white mb-4 flex items-center'>
            <FaCheckCircle className='mr-2 text-green-500' />
            Payment Instructions
          </h3>
          
          <ol className='text-gray-300 space-y-3 mb-6'>
            <li className='flex items-start'>
              <span className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0'>1</span>
              <span>Pay ₹{course?.price} to the UPI ID below using any UPI app</span>
            </li>
            <li className='flex items-start'>
              <span className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0'>2</span>
              <span>Note down your Transaction ID after payment</span>
            </li>
            <li className='flex items-start'>
              <span className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0'>3</span>
              <span>Enter the Transaction ID and your UPI ID below</span>
            </li>
            <li className='flex items-start'>
              <span className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0'>4</span>
              <span>Admin will verify and activate your course within 24 hours</span>
            </li>
          </ol>

          {/* UPI ID Display */}
          <div className='bg-gray-700 rounded-lg p-4'>
            <p className='text-gray-400 text-sm mb-2'>Pay to this UPI ID:</p>
            <div className='flex items-center justify-between bg-gray-900 rounded p-3'>
              <span className='text-white font-mono text-lg'>{YOUR_UPI_ID}</span>
              <button
                onClick={copyUpiId}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition'
              >
                {copied ? <FaCheckCircle className='mr-2' /> : <FaCopy className='mr-2' />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Confirmation Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-400 mb-2'>Transaction ID / UTR Number *</label>
            <input
              type='text'
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder='Enter 12-digit transaction ID'
              className='w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
            <p className='text-gray-500 text-xs mt-1'>Find this in your payment app after completing payment</p>
          </div>

          <div>
            <label className='block text-gray-400 mb-2'>Your UPI ID *</label>
            <input
              type='text'
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder='yourname@paytm'
              className='w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
            <p className='text-gray-500 text-xs mt-1'>Enter the UPI ID you used for payment</p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed'
          >
            {loading ? "Submitting..." : "Submit Payment Details"}
          </button>
        </form>

        <p className='text-gray-500 text-center text-sm mt-6'>
          ⚠️ Make sure to enter correct transaction ID. False submissions will be rejected.
        </p>

        {/* Back to Home Button */}
        <div className='mt-4 text-center'>
          <button
            onClick={() => navigate("/")}
            className='text-blue-400 hover:text-blue-300 underline'
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Buy;
