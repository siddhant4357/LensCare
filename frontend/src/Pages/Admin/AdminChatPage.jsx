import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getCurrentUser } from '../../services/authService';

const AdminChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [activeConversations, setActiveConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
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
      console.log("Received conversations:", conversations);
      setActiveConversations(conversations);
    };
    
    // Function to handle new message - keep for individual message updates
    const handleNewMessage = (messageData) => {
      console.log("Admin received message:", messageData);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Support Chat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-y-auto lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          
          {Object.keys(activeConversations).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active conversations</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(activeConversations).map(([userId, data]) => (
                <div 
                  key={userId}
                  onClick={() => selectConversation(userId)}
                  className={`p-3 rounded-md cursor-pointer flex items-center justify-between 
                    ${selectedUser === userId ? 'bg-gray-100' : 'hover:bg-gray-50'} 
                    ${data.unread ? 'border-l-4 border-black' : ''}`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-700">
                        {data.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{data.userName || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                        {data.messages[data.messages.length - 1]?.content || 'No messages'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`w-3 h-3 rounded-full ${
                      onlineUsers.includes(userId) ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat Window */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col lg:col-span-3">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-700">
                      {activeConversations[selectedUser]?.userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{activeConversations[selectedUser]?.userName || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">
                      {onlineUsers.includes(selectedUser) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {activeConversations[selectedUser]?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${msg.isAdmin ? 'flex justify-end' : 'flex justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg p-3 ${
                        msg.isAdmin ? 'bg-black text-white' : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white p-2 rounded-r hover:bg-gray-800 px-4"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="mt-2">Choose a customer conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;