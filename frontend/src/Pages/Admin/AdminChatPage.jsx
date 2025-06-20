import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getCurrentUser } from '../../services/authService';

const AdminChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [activeConversations, setActiveConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const conversationsRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const user = getCurrentUser();
  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Set up event listeners after socket is created
  useEffect(() => {
    if (!socket) return;
    
    // Identify as admin
    socket.emit('adminConnected', { 
      adminId: user?._id, 
      adminName: user?.name 
    });
    
    // Function to handle all conversations
    const handleConversations = (conversations) => {
      setActiveConversations(conversations);
    };
    
    // Function to handle new message - keep for individual message updates
    const handleNewMessage = (messageData) => {
      // Admin logic for individual messages (optional as we're also updating via allConversations)
    };
    
    // Function to handle online users
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };
    
    // Add event listeners
    socket.on('allConversations', handleConversations);
    socket.on('newMessage', handleNewMessage);
    socket.on('onlineUsers', handleOnlineUsers);
    
    // Clean up event listeners
    return () => {
      socket.off('allConversations', handleConversations);
      socket.off('newMessage', handleNewMessage);
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    // Using a small timeout to ensure DOM is updated
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedUser, activeConversations]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && selectedUser) {
      const messageData = {
        sender: user?.name || 'Admin',
        userId: user?._id,
        recipientId: selectedUser,
        content: newMessage,
        timestamp: new Date(),
        isAdmin: true
      };
      
      socket.emit('adminMessage', messageData);
      setNewMessage('');
      
      // Update local state for immediate display
      setActiveConversations(prev => {
        const updatedConversations = { ...prev };
        if (updatedConversations[selectedUser]) {
          updatedConversations[selectedUser].messages.push(messageData);
        }
        return updatedConversations;
      });
    }
  };
  
  const selectConversation = (userId) => {
    setSelectedUser(userId);
    setIsMobileMenuOpen(false);
    
    // Mark as read
    setActiveConversations(prev => {
      const updatedConversations = { ...prev };
      if (updatedConversations[userId]) {
        updatedConversations[userId].unread = false;
        
        // Emit message to server that this conversation is now read
        if (socket) {
          socket.emit('markConversationRead', { userId });
        }
      }
      return updatedConversations;
    });
  };
  
  // Count unread conversations
  const unreadCount = Object.values(activeConversations).filter(conv => conv.unread).length;
  
  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">
              Customer
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
                Support
              </span>
            </h1>
            <div className="w-20 h-1 bg-black mb-4"></div>
            <p className="text-gray-600 max-w-3xl">
              Manage real-time customer conversations and provide timely assistance
            </p>
          </div>
          
          {/* Mobile toggle button */}
          <button 
            className="lg:hidden mt-4 md:mt-0 flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            View Conversations
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>
            )}
          </button>
        </div>
      </div>

   
     
      {/* Main Chat Interface */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl border border-gray-100">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-320px)] min-h-[500px]">
          {/* Sidebar - Hidden on mobile by default */}
          <div className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            lg:block lg:w-1/4 xl:w-1/5 bg-white border-r border-gray-200
            fixed inset-0 z-40 lg:static lg:z-auto
            transition-all duration-300 transform h-full
          `}>
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Active Conversations</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold p-4 mb-2 hidden lg:block border-b border-gray-100">Active Conversations</h2>
              
              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3" ref={conversationsRef}>
                {Object.keys(activeConversations).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No active conversations</p>
                  </div>
                ) : (
                  Object.entries(activeConversations).map(([userId, data]) => (
                    <div 
                      key={userId}
                      onClick={() => selectConversation(userId)}
                      className={`group p-4 rounded-xl cursor-pointer flex items-center justify-between
                        transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md
                        ${selectedUser === userId 
                          ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-md' 
                          : 'hover:bg-gray-50 bg-white shadow-sm border border-gray-100'} 
                        ${data.unread ? 'border-l-4 border-black' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center mr-3
                          ${selectedUser === userId 
                            ? 'bg-white text-black' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'}
                        `}>
                          <span className="font-bold text-lg">
                            {data.userName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className={`font-medium ${selectedUser === userId ? 'text-white' : 'text-gray-900'}`}>
                            {data.userName || 'Unknown User'}
                          </p>
                          <p className={`text-xs truncate max-w-[120px] ${
                            selectedUser === userId ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {data.messages[data.messages.length - 1]?.content || 'No messages'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`w-3 h-3 rounded-full mb-2 ${
                          onlineUsers.includes(userId) ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        {data.unread && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            new
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="flex-1 flex flex-col h-full">
            {selectedUser ? (
              <>
                {/* Chat header */}
                <div className="p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 shadow-sm">
                      <span className="font-bold text-gray-700 text-lg">
                        {activeConversations[selectedUser]?.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-bold text-lg text-gray-900">
                          {activeConversations[selectedUser]?.userName || 'Unknown User'}
                        </p>
                        <span className={`ml-3 px-3 py-1 text-xs rounded-full ${
                          onlineUsers.includes(selectedUser) 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {onlineUsers.includes(selectedUser) ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {activeConversations[selectedUser]?.messages.length} messages
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Messages area */}
                <div 
                  className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 md:p-6"
                  ref={messagesContainerRef}
                >
                  <div className="flex flex-col min-h-full">
                    <div className="flex-1">
                      {activeConversations[selectedUser]?.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-4 animate-fade-in ${msg.isAdmin ? 'flex justify-end' : 'flex justify-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                              msg.isAdmin 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white' 
                                : msg.type === 'system' 
                                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900' 
                                  : msg.type === 'appointment' 
                                    ? 'bg-green-50 border-l-4 border-green-500 text-green-900' 
                                    : 'bg-white border border-gray-100'
                            }`}
                          >
                            <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                            <p className={`text-xs text-right mt-2 ${
                              msg.isAdmin ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message input */}
                <form onSubmit={sendMessage} className="p-4 md:p-6 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="group relative px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center">
                        Send
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white p-6">
                <div className="text-center max-w-md mx-auto">
                  <div className="bg-gray-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Select a conversation</h3>
                  <p className="text-gray-600 mb-8">Choose a customer conversation from the list to start chatting</p>
                  
                  {/* Mobile only button */}
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden group relative px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center">
                      View Conversations
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;