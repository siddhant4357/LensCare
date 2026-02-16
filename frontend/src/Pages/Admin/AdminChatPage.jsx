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
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);
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

  // Scroll to bottom only on new selection or sending message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [selectedUser]); // Only scroll on user switch

  // Auto-scroll on new messages ONLY if already near bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      // Check if user is near bottom (within 100px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeConversations[selectedUser]?.messages]); // Only run when THIS conversation's messages change

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

      // Update local state and force scroll
      setActiveConversations(prev => {
        const updatedConversations = { ...prev };
        if (updatedConversations[selectedUser]) {
          updatedConversations[selectedUser].messages.push(messageData);
        }
        return updatedConversations;
      });

      // Force scroll to bottom when admin sends
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
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

  // Calculate height for chat area using dvh for mobile browsers
  const chatHeight = 'calc(100dvh - 140px)';

  return (
    <div className="min-h-screen py-4 md:py-6 px-2 md:px-4 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden max-h-screen">
      {/* Page Header */}
      <div className="mb-2 md:mb-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2 text-gray-900">
              Customer
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-2 md:ml-3">
                Support
              </span>
            </h1>
            <div className="w-20 h-1 bg-black mb-2 hidden md:block"></div>
          </div>

          {/* Mobile toggle button */}
          {!isMobileMenuOpen && selectedUser && (
            <button
              className="md:hidden self-start mb-2 flex items-center px-3 py-1.5 bg-black text-white rounded-lg text-xs"
              onClick={() => {
                setSelectedUser(null);
                setIsMobileMenuOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>



      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row" style={{ height: chatHeight }}>
        {/* Sidebar - Users List */}
        <div className={`
          w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-50 border-r border-gray-200 flex flex-col
          ${selectedUser ? 'hidden md:flex' : 'flex'}
        `}>
          <h2 className="text-lg font-bold p-4 border-b border-gray-200 bg-white">
            Conversations {/* ({Object.keys(activeConversations).length}) */}
          </h2>

          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2" ref={conversationsRef}>
            {Object.keys(activeConversations).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No active conversations</p>
              </div>
            ) : (
              Object.entries(activeConversations).map(([userId, data]) => (
                <div
                  key={userId}
                  onClick={() => selectConversation(userId)}
                  className={`group p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200
                    ${selectedUser === userId
                      ? 'bg-black text-white shadow-md'
                      : 'hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center overflow-hidden">
                    <div className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3
                      ${selectedUser === userId
                        ? 'bg-white text-black'
                        : 'bg-gray-200 text-gray-700'}
                    `}>
                      <span className="font-bold text-sm md:text-base">
                        {data.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium text-sm md:text-base truncate ${selectedUser === userId ? 'text-white' : 'text-gray-900'}`}>
                        {data.userName || 'Unknown'}
                      </p>
                      <p className={`text-xs truncate ${selectedUser === userId ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                        {data.messages[data.messages.length - 1]?.content || '...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className={`w-2 h-2 rounded-full mb-1 ${onlineUsers.includes(userId) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></span>
                    {data.unread && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`
          flex-1 flex flex-col bg-white h-full
          ${!selectedUser ? 'hidden md:flex' : 'flex'}
        `}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-3 text-gray-500"
                    onClick={() => setSelectedUser(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-gray-700">
                      {activeConversations[selectedUser]?.userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {activeConversations[selectedUser]?.userName || 'User'}
                    </h3>
                    <span className={`text-xs flex items-center ${onlineUsers.includes(selectedUser) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                      {onlineUsers.includes(selectedUser) ? '● Online' : '○ Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages - Crucial for scrolling: flex-1 and overflow-y-auto */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4" ref={messagesContainerRef}>
                {activeConversations[selectedUser]?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base ${msg.isAdmin
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.isAdmin ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-3 md:p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 md:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="p-2 md:p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-md"
                    disabled={!newMessage.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Conversation</h3>
              <p className="text-gray-500 max-w-xs">Choose a customer from the list on the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;