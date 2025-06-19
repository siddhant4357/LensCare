import React, { useState, useEffect } from 'react';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  deleteAppointment 
} from '../../services/appointmentService';
import { getUsers } from '../../services/userService';
import { getFrames } from '../../services/frameService';
import { createNotification } from '../../services/notificationService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    appointments: 0,
    users: 0,
    products: 0
    // Remove revenue property
  });
  
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    recipient: '',
    message: '',
    type: 'system'
    // Removed link property
  });
  const [users, setUsers] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const appointmentsData = await getAppointments(1, 5);
        const usersData = await getUsers();
        const framesData = await getFrames(); // Make sure this is being called
        
        setRecentAppointments(appointmentsData.slice(0, 5));
        setUsers(usersData);
        
        // Ensure products count is correctly set
        setStats({
          appointments: appointmentsData.length || 0,
          users: usersData.length || 0,
          products: Array.isArray(framesData.frames) ? framesData.frames.length : 
                   (framesData && framesData.length ? framesData.length : 0)
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Navigate to add new product page
  const handleNewProduct = () => {
    navigate('/admin/products/create');
  };

  // Open notification modal
  const openNotificationModal = () => {
    setIsNotificationModalOpen(true);
  };
  
  // Close notification modal
  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationData({
      recipient: '',
      message: '',
      type: 'system'
      // Removed link property
    });
  };
  
  // Handle notification input changes
  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await createNotification(notificationData);
      toast.success('Notification sent successfully');
      closeNotificationModal();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  // Delete appointment
  const handleDeleteAppointment = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete._id);
        
        // Update the recentAppointments state to remove the deleted appointment
        setRecentAppointments(prevAppointments => 
          prevAppointments.filter(apt => apt._id !== appointmentToDelete._id)
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          appointments: prev.appointments - 1
        }));
        
        toast.success('Appointment removed successfully');
        closeDeleteModal();
      } catch (error) {
        toast.error('Failed to delete appointment');
        console.error('Error deleting appointment:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointments</p>
                  <p className="text-2xl font-bold">{stats.appointments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Users</p>
                  <p className="text-2xl font-bold">{stats.users}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-2xl font-bold">{stats.products}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment._id || appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{appointment._id || appointment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => confirmDelete(appointment)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete appointment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={handleNewProduct}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </button>
              <button 
                onClick={openNotificationModal}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Send Notification
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
            
            <form onSubmit={handleSendNotification}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <select
                  name="recipient"
                  value={notificationData.recipient}
                  onChange={handleNotificationChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">-- Select User --</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={notificationData.message}
                  onChange={handleNotificationChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={notificationData.type}
                  onChange={handleNotificationChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="system">System</option>
                  <option value="appointment">Appointment</option>
                  <option value="message">Message</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeNotificationModal}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
     {isDeleteModalOpen && appointmentToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Appointment</h3>
          <p className="text-gray-600">
            Are you sure you want to delete this appointment for {appointmentToDelete.name || 'this client'} on {appointmentToDelete.date} at {appointmentToDelete.time}? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={closeDeleteModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            onClick={handleDeleteAppointment}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;