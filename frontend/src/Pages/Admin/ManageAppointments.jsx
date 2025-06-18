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
  
  // Add this function to properly update appointment status
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
  
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Appointments</h1>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, email, or service..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex">
            <button
              className={`px-4 py-2 rounded-l-md ${currentFilter === 'all' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setCurrentFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${currentFilter === 'Pending' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setCurrentFilter('Pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 ${currentFilter === 'Confirmed' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setCurrentFilter('Confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`px-4 py-2 rounded-r-md ${currentFilter === 'Cancelled' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setCurrentFilter('Cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>
      
      {/* Appointments Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">No appointments found</p>
          {searchTerm || currentFilter !== 'all' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentFilter('all');
              }}
              className="text-black underline hover:no-underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{appointment._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => viewAppointmentDetails(appointment)}
                        className="text-black hover:underline mr-4"
                      >
                        View
                      </button>
                      <select 
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Confirmed">Confirm</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Appointment Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Appointment ID</span>
                  <span>#{selectedAppointment._id}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <p>{selectedAppointment.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p>{selectedAppointment.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <p>{selectedAppointment.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Service</label>
                      <p>{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Date</label>
                      <p>{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Time</label>
                      <p>{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>
                
                {selectedAppointment.notes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Notes</h3>
                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 flex justify-end space-x-2">
                  <select 
                    value={selectedAppointment.status}
                    onChange={(e) => handleStatusChange(selectedAppointment._id, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Confirmed">Confirm</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancel</option>
                  </select>
                  
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageAppointments;