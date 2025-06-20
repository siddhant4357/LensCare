import { useState, useEffect } from 'react';
import { getAllFeedback, approveFeedback } from '../../services/feedbackService';
import { toast } from 'react-toastify';

const ManageFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await getAllFeedback();
        setFeedback(data);
      } catch (error) {
        setError('Failed to load feedback');
        toast.error('Error loading feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveFeedback(id);
      
      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item._id === id ? { ...item, approved: true } : item
        )
      );
      
      toast.success('Feedback approved successfully');
    } catch (error) {
      toast.error('Failed to approve feedback');
    }
  };

  // Filter feedback items based on current filter
  const filteredFeedback = feedback.filter(item => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'approved') return item.approved;
    if (currentFilter === 'pending') return !item.approved;
    return true;
  });

  if (loading) return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Feedback</h1>
      <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-t-4 border-b-4 border-gray-400 rounded-full animate-ping absolute top-0 opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading feedback data...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Feedback</h1>
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Manage Feedback</h1>
        <div className="flex items-center overflow-x-auto whitespace-nowrap p-2 -mx-2">
          <button
            className={`px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 mr-2 ${currentFilter === 'all' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('all')}
          >
            All Feedback
          </button>
          <button
            className={`px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 mr-2 ${currentFilter === 'approved' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${currentFilter === 'pending' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentFilter('pending')}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Stats Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden relative border border-gray-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-blue-100 opacity-50"></div>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">{feedback.filter(item => item.approved).length}</h2>
              <p className="text-gray-600 font-medium">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden relative border border-gray-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-yellow-100 opacity-50"></div>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">{feedback.filter(item => !item.approved).length}</h2>
              <p className="text-gray-600 font-medium">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden relative border border-gray-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-green-100 opacity-50"></div>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">{feedback.length}</h2>
              <p className="text-gray-600 font-medium">Total Feedback</p>
            </div>
          </div>
        </div>
      </div>
      
      {filteredFeedback.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl shadow-md border border-gray-100 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">
            {currentFilter === 'all' 
              ? 'No feedback submissions found.' 
              : `No ${currentFilter} feedback submissions.`}
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeedback.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                            <span>{item.user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                            <div className="text-sm text-gray-500">{item.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{item.comment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!item.approved && (
                          <button 
                            onClick={() => handleApprove(item._id)}
                            className="px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredFeedback.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">{item.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.user.name}</h3>
                    <p className="text-sm text-gray-500">{item.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-gray-700">{item.comment}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.approved ? 'Approved' : 'Pending'}
                  </span>
                  
                  {!item.approved && (
                    <button 
                      onClick={() => handleApprove(item._id)}
                      className="px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeedbackPage;