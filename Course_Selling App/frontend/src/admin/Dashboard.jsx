// admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaBook, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    pendingPayments: 0,
    verifiedPayments: 0
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:3000/api/v1/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      setStats(response.data.stats);
      setRecentPurchases(response.data.recentPurchases);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard");
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
            <Link to="/admin/dashboard" className="border-b-2 border-blue-500 py-4 px-1 text-blue-600 font-medium">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaBook className="text-4xl text-blue-600" />
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaUsers className="text-4xl text-green-600" />
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaClock className="text-4xl text-yellow-600" />
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaCheckCircle className="text-4xl text-purple-600" />
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Verified Payments</p>
                <p className="text-2xl font-bold">{stats.verifiedPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Purchase Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UPI ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No purchase requests yet
                    </td>
                  </tr>
                ) : (
                  recentPurchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {purchase.userId.firstName} {purchase.userId.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{purchase.userId.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{purchase.courseId.title}</div>
                        <div className="text-sm text-gray-500">₹{purchase.courseId.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {purchase.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {purchase.upiId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${purchase.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                            purchase.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {purchase.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {purchase.paymentStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => verifyPayment(purchase._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaCheckCircle className="inline mr-1" /> Verify
                            </button>
                            <button
                              onClick={() => rejectPayment(purchase._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimesCircle className="inline mr-1" /> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );

  async function verifyPayment(purchaseId) {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:3000/api/v1/admin/verify-payment/${purchaseId}`,
        { status: "verified" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      toast.success("Payment verified successfully!");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to verify payment");
    }
  }

  async function rejectPayment(purchaseId) {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:3000/api/v1/admin/verify-payment/${purchaseId}`,
        { status: "rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      toast.success("Payment rejected");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to reject payment");
    }
  }
};

export default Dashboard;