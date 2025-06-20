import { useState, useEffect } from 'react';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  deleteAppointment 
} from '../../services/appointmentService';
import { toast } from 'react-toastify';

const AdminManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        toast.error('Failed to fetch appointments');
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  useEffect(() => {
    let result = [...appointments];
    
    // Apply status filter
    if (currentFilter !== 'all') {
      result = result.filter(appointment => appointment.status === currentFilter);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(appointment => 
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAppointments(result);
  }, [currentFilter, searchTerm, appointments]);
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Call API to update status
      await updateAppointmentStatus(id, newStatus);
      
      // Update local state with the new status
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === id ? { ...appointment, status: newStatus } : appointment
        )
      );
      
      // If the appointment is currently being viewed in the modal, update it there too
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment(prev => ({...prev, status: newStatus}));
      }
      
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update appointment status');
      console.error('Error updating status:', error);
    }
  };
  
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    
    try {
      await deleteAppointment(appointmentToDelete._id);
      
      // Update local state by removing the deleted appointment
      setAppointments(prevAppointments => 
        prevAppointments.filter(appointment => appointment._id !== appointmentToDelete._id)
      );
      
      toast.success('Appointment deleted successfully');
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to delete appointment');
      console.error('Error deleting appointment:', error);
    }
  };
  
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };
  
  const openDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight tracking-tight">
          Manage 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
            Appointments
          </span>
        </h1>
        <p className="text-gray-600">Schedule, view, and manage all patient appointments</p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search appointments
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by name, email, or service..."
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Buttons - Responsive Design */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                className={`py-2 px-3 rounded-xl font-medium transition-all duration-300 ${currentFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentFilter('all')}
              >
                All
              </button>
              <button
                className={`py-2 px-3 rounded-xl font-medium transition-all duration-300 ${currentFilter === 'Pending' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentFilter('Pending')}
              >
                Pending
              </button>
              <button
                className={`py-2 px-3 rounded-xl font-medium transition-all duration-300 ${currentFilter === 'Confirmed' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentFilter('Confirmed')}
              >
                Confirmed
              </button>
              <button
                className={`py-2 px-3 rounded-xl font-medium transition-all duration-300 ${currentFilter === 'Cancelled' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentFilter('Cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointments Content */}
      {loading ? (
        <div className="bg-gradient-to-br from-gray-50 to-white p-12 rounded-2xl shadow-lg flex justify-center items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-t-4 border-b-4 border-gray-400 rounded-full animate-ping absolute top-0 opacity-20"></div>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-white p-12 rounded-2xl shadow-lg text-center">
          <div className="rounded-full bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-6">There are no appointments matching your current filters.</p>
          {searchTerm || currentFilter !== 'all' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentFilter('all');
              }}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-700">
                            {appointment.name?.charAt(0) || 
                             appointment.firstName?.charAt(0) || 
                             '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.name || 
                             (appointment.firstName && appointment.lastName ? 
                              `${appointment.firstName} ${appointment.lastName}` : 
                              appointment.firstName || 'Unknown')}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                        {appointment.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => viewAppointmentDetails(appointment)}
                        className="text-black hover:underline mr-3"
                      >
                        View
                      </button>
                      <select 
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 mr-3 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                      >
                        <option value="Confirmed">Confirm</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                      <button 
                        onClick={() => openDeleteModal(appointment)}
                        className="text-red-600 hover:text-red-800"
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
          
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="font-medium text-gray-700">
                        {appointment.name?.charAt(0) || 
                         appointment.firstName?.charAt(0) || 
                         '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.name || 
                         (appointment.firstName && appointment.lastName ? 
                          `${appointment.firstName} ${appointment.lastName}` : 
                          appointment.firstName || 'Unknown')}
                      </h3>
                      <p className="text-sm text-gray-500">{appointment.email || 'No email'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="block text-gray-500">Service</span>
                    <span className="font-medium">{appointment.service}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Date & Time</span>
                    <span className="font-medium">{appointment.date}, {appointment.time}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => viewAppointmentDetails(appointment)}
                    className="text-black hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  
                  <div className="flex items-center">
                    <select 
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 mr-3 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    >
                      <option value="Confirmed">Confirm</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancel</option>
                    </select>
                    
                    <button 
                      onClick={() => openDeleteModal(appointment)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-fade-in-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-700 font-medium">Status</span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <label className="text-xs text-gray-500 block">Name</label>
                      <p className="font-medium">
                        {selectedAppointment.name || 
                         (selectedAppointment.firstName && selectedAppointment.lastName ? 
                          `${selectedAppointment.firstName} ${selectedAppointment.lastName}` : 
                          selectedAppointment.firstName || 'Unknown')}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Email</label>
                      <p className="font-medium">{selectedAppointment.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Phone</label>
                      <p className="font-medium">{selectedAppointment.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <label className="text-xs text-gray-500 block">Service</label>
                      <p className="font-medium">{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Date</label>
                      <p className="font-medium">{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Time</label>
                      <p className="font-medium">{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>
                
                {selectedAppointment.notes && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3 justify-end">
                  <select 
                    value={selectedAppointment.status}
                    onChange={(e) => handleStatusChange(selectedAppointment._id, e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  >
                    <option value="Confirmed">Confirm</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancel</option>
                  </select>
                  
                  <button 
                    onClick={() => {
                      closeModal();
                      openDeleteModal(selectedAppointment);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300"
                  >
                    Delete
                  </button>
                  
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && appointmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
            <div className="mb-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg className="h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Appointment</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this appointment for <span className="font-medium">
                  {appointmentToDelete.name || 
                   (appointmentToDelete.firstName && appointmentToDelete.lastName ? 
                    `${appointmentToDelete.firstName} ${appointmentToDelete.lastName}` : 
                    appointmentToDelete.firstName || 'this client')}
                </span> on {appointmentToDelete.date || 'unknown date'} at {appointmentToDelete.time || 'unknown time'}? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 font-medium"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                onClick={handleDeleteAppointment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageAppointments;