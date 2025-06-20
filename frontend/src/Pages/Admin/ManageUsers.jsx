import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (currentFilter !== 'all') {
      result = result.filter(user => user.role === currentFilter);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }
    
    setFilteredUsers(result);
  }, [currentFilter, searchTerm, users]);
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateUser(id, { status: newStatus });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
      
      // If the user is currently being viewed, update its status in the modal
      if (selectedUser && selectedUser._id === id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };
  
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id ? { ...user, role: newRole } : user
        )
      );
      
      // If the user is currently being viewed, update its role in the modal
      if (selectedUser && selectedUser._id === id) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };
  
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };
  
  const deleteUserHandler = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id);
        
        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
        
        // Close the delete modal
        closeDeleteModal();
        
        // If the deleted user was being viewed, close the details modal too
        if (selectedUser && selectedUser._id === userToDelete._id) {
          closeModal();
        }
        
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 p-4 md:p-8">
      <div className="mb-8 md:mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight tracking-tight">
          User
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 ml-2 md:ml-3">
            Management
          </span>
        </h1>
        <div className="w-16 md:w-20 h-1 bg-black mb-4 md:mb-6"></div>
        <p className="text-lg md:text-xl text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        <div className="relative w-full lg:max-w-md mb-4 lg:mb-0">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full px-4 md:px-5 py-3 md:py-4 pr-10 md:pr-12 border-0 rounded-lg md:rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center bg-white rounded-lg md:rounded-xl shadow-lg p-1 w-full lg:w-auto overflow-x-auto hide-scrollbar">
          <button
            className={`px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${currentFilter === 'all' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('all')}
          >
            All Users
          </button>
          <button
            className={`px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${currentFilter === 'customer' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('customer')}
          >
            Customers
          </button>
          <button
            className={`px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${currentFilter === 'admin' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('admin')}
          >
            Admins
          </button>
        </div>
      </div>
      
      {/* Users Content */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
              <div className="w-12 h-12 md:w-16 md:h-16 border-t-4 border-b-4 border-gray-400 rounded-full animate-ping absolute top-0 opacity-20"></div>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-400 mb-4 md:mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg md:text-xl text-gray-500 mb-4 md:mb-6">No users found</p>
            {(searchTerm || currentFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCurrentFilter('all');
                }}
                className="text-black underline hover:no-underline font-medium"
              >
                Clear filters and show all users
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table view for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white">
                    <th className="px-4 py-4 md:px-6 md:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-4 md:px-6 md:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-4 md:px-6 md:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-4 md:px-6 md:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-4 md:px-6 md:py-5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap text-sm text-gray-500">
                        #{user._id?.substring(0, 6) || user.id}
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 md:h-14 md:w-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-base md:text-lg font-medium">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3 md:ml-4">
                            <div className="text-sm md:text-base font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs md:text-sm text-gray-500 mt-1">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap">
                        <span className={`px-2 py-1 md:px-3 md:py-1.5 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Customer'}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap">
                        <span className={`px-2 py-1 md:px-3 md:py-1.5 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2 md:space-x-3">
                          <button 
                            onClick={() => viewUserDetails(user)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-all duration-200 flex items-center text-xs md:text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button 
                            onClick={() => confirmDelete(user)}
                            className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-all duration-200 flex items-center text-xs md:text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Card view for mobile */}
            <div className="md:hidden">
              {filteredUsers.map((user) => (
                <div key={user._id || user.id} className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-lg font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Customer'}
                    </span>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                      {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Active'}
                    </span>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      ID: #{user._id?.substring(0, 6) || user.id}
                    </span>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => viewUserDetails(user)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-all duration-200 flex items-center text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      onClick={() => confirmDelete(user)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg transition-all duration-200 flex items-center text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-fade-in-up">
            <div className="p-5 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold">User Details</h2>
                <button 
                  onClick={closeModal} 
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 items-center justify-center mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl text-white font-medium">{selectedUser.name?.charAt(0) || 'U'}</span>
                </div>
                <h3 className="mt-2 text-lg md:text-xl font-bold">{selectedUser.name}</h3>
                <div className="flex justify-center mt-2 space-x-2">
                  <span className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm font-semibold rounded-full ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                    {selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1) || 'Customer'}
                  </span>
                  <span className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm font-semibold rounded-full ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    {selectedUser.status?.charAt(0).toUpperCase() + selectedUser.status?.slice(1) || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-5 md:space-y-6">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Contact Information</h3>
                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block">Email</label>
                        <p className="text-xs md:text-sm font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">Phone</label>
                        <p className="text-xs md:text-sm font-medium">{selectedUser.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Address</h3>
                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
                    <p className="text-xs md:text-sm">{selectedUser.address || 'No address provided'}</p>
                  </div>
                </div>
                
                <div className="pt-3 md:pt-4 border-t border-gray-200">
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">User Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-xs md:text-sm text-gray-700 block mb-1">Role</label>
                      <select 
                        value={selectedUser.role || 'customer'}
                        onChange={(e) => handleRoleChange(selectedUser._id || selectedUser.id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm text-gray-700 block mb-1">Status</label>
                      <select 
                        value={selectedUser.status || 'active'}
                        onChange={(e) => handleStatusChange(selectedUser._id || selectedUser.id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between pt-3 md:pt-4 border-t border-gray-200 gap-3 md:gap-0">
                  <button 
                    onClick={() => confirmDelete(selectedUser)}
                    className="px-4 py-2 md:px-5 md:py-3 border border-red-300 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 font-medium flex items-center justify-center md:justify-start text-xs md:text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete User
                  </button>
                  
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg font-medium text-xs md:text-sm"
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
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in-up">
            <div className="p-5 md:p-8">
              <div className="text-center mb-5 md:mb-6">
                <div className="mx-auto flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-red-100 mb-4 md:mb-6">
                  <svg className="h-8 w-8 md:h-10 md:w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Delete User</h3>
                <p className="text-gray-600 text-sm md:text-base mb-2">
                  Are you sure you want to delete <span className="font-medium">{userToDelete.name}</span>? 
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
                <button
                  type="button"
                  className="px-5 py-2.5 md:px-6 md:py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 font-medium text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
                  onClick={deleteUserHandler}
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

export default AdminManageUsers;